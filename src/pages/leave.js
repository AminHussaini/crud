import LeaveApplicationForm from "@/components/LeaveApplicationForm";
import LeaveBalanceForm from "@/components/LeaveBalanceForm";
import LeaveBalanceList from "@/components/LeaveBalanceList";
import LeaveHistory from "@/components/LeaveHistory";
import React from "react";

const LeavePage = ({isId06}) => {
  const [leaves, setLeaves] = React.useState([]);
  const [leaveBalances, setLeaveBalances] = React.useState([]);
  const [selectedLeave, setSelectedLeave] = React.useState(null);
  const [selectedBalance, setSelectedBalance] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(true);
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [activeTab, setActiveTab] = React.useState('balance');
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());

  React.useEffect(() => {
    fetchLeaves();
    fetchLeaveBalances();
    console.log({leaveBalances,leaves})
  }, [selectedYear]);

  const fetchLeaves = async () => {
    const res = await fetch('/api/leaves');
    const data = await res.json();
    setLeaves(data);
  };

  const fetchLeaveBalances = async () => {
    const res = await fetch(`/api/leave-balance?year=${selectedYear}`);
    const data = await res.json();
    setLeaveBalances(data);
  };

  const handleCreateLeave = async (leaveData) => {
    const res = await fetch('/api/leaves/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaveData),
    });

    if (res.ok) {
      const createdLeave = await res.json();
      setLeaves([createdLeave, ...leaves]);
      setSelectedLeave(null);
      alert('Leave application submitted successfully!');
    }
  };

  const handleUpdateLeave = async (leaveData) => {
    const res = await fetch(`/api/leaves/update/${selectedLeave._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaveData),
    });

    if (res.ok) {
      const updatedLeave = await res.json();
      setLeaves(leaves.map((leave) =>
        leave._id === selectedLeave._id ? updatedLeave : leave
      ));
      setSelectedLeave(null);
      alert('Leave application updated successfully!');
    }
  };

  const handleDeleteLeave = async (leaveId) => {
    if (confirm('Are you sure you want to delete this leave application?')) {
      const res = await fetch(`/api/leaves/delete/${leaveId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setLeaves(leaves.filter((leave) => leave._id !== leaveId));
      }
    }
  };

  const handleApprove = async (leaveId) => {
    const res = await fetch(`/api/leaves/update/${leaveId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Approved',
        approvedBy: 'Admin',
        approvedDate: new Date(),
      }),
    });

    if (res.ok) {
      fetchLeaves();
      alert('Leave approved successfully!');
    }
  };

  const handleReject = async (leaveId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      const res = await fetch(`/api/leaves/update/${leaveId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Rejected',
          rejectionReason: reason,
          approvedBy: 'Admin',
          approvedDate: new Date(),
        }),
      });

      if (res.ok) {
        fetchLeaves();
        alert('Leave rejected!');
      }
    }
  };

  const handleCreateBalance = async (balanceData) => {
    const res = await fetch('/api/leave-balance/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(balanceData),
    });

    if (res.ok) {
      const createdBalance = await res.json();
      setLeaveBalances([createdBalance, ...leaveBalances]);
      setSelectedBalance(null);
      alert('Leave balance added successfully!');
    } else {
      const error = await res.json();
      alert(error.error || 'Failed to add leave balance');
    }
  };

  const handleUpdateBalance = async (balanceData) => {
    const res = await fetch(`/api/leave-balance/update/${selectedBalance._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(balanceData),
    });

    if (res.ok) {
      const updatedBalance = await res.json();
      setLeaveBalances(leaveBalances.map((balance) =>
        balance._id === selectedBalance._id ? updatedBalance : balance
      ));
      setSelectedBalance(null);
      alert('Leave balance updated successfully!');
    }
  };

  const handleDeleteBalance = async (balanceId) => {
    if (confirm('Are you sure you want to delete this leave balance?')) {
      const res = await fetch(`/api/leave-balance/delete/${balanceId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setLeaveBalances(leaveBalances.filter((balance) => balance._id !== balanceId));
      }
    }
  };

  const filteredLeaves = filterStatus === 'all'
    ? leaves
    : leaves.filter(leave => leave.status === filterStatus);

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>Leave Management System</h1>

      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('apply')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'apply' ? styles.tabButtonActive : {}),
          }}
        >
          Apply Leave
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'history' ? styles.tabButtonActive : {}),
          }}
        >
          Leave History
        </button>
        <button
          onClick={() => setActiveTab('balance')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'balance' ? styles.tabButtonActive : {}),
          }}
        >
          Leave Balance
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('manage')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'manage' ? styles.tabButtonActive : {}),
            }}
          >
            Manage Balances
          </button>
        )}
      </div>

      {activeTab === 'apply' && (
        <>
          {selectedLeave ? (
            <LeaveApplicationForm
              styles={styles}
              isId06={isId06}
              onSubmit={handleUpdateLeave}
              initialData={selectedLeave}
              onCancel={() => setSelectedLeave(null)}
              leaveBalances={leaveBalances}
            />
          ) : (
            <LeaveApplicationForm
              styles={styles}
              isId06={isId06}
              onSubmit={handleCreateLeave}
              leaveBalances={leaveBalances}
            />
          )}
        </>
      )}

      {activeTab === 'history' && (
        <>
          <div style={styles.filterContainer}>
            <label style={styles.label}>Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={styles.select}
            >
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <LeaveHistory
            styles={styles}
            isId06={isId06}
            leaves={filteredLeaves}
            onEdit={setSelectedLeave}
            onDelete={handleDeleteLeave}
            onApprove={handleApprove}
            onReject={handleReject}
            isAdmin={isAdmin}
          />
        </>
      )}

      {activeTab === 'balance' && (
        <>
          <div style={styles.filterContainer}>
            <label style={styles.label}>Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={styles.select}
            >
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>
          <LeaveBalanceList
            isId06={isId06}
            styles={styles}
            balances={leaveBalances}
            onEdit={setSelectedBalance}
            onDelete={handleDeleteBalance}
          />
        </>
      )}

      {activeTab === 'manage' && isAdmin && (
        <>
          {selectedBalance ? (
            <LeaveBalanceForm
              isId06={isId06}
              styles={styles}
              onSubmit={handleUpdateBalance}
              initialData={selectedBalance}
              onCancel={() => setSelectedBalance(null)}
            />
          ) : (
            <LeaveBalanceForm styles={styles} onSubmit={handleCreateBalance} />
          )}
          <LeaveBalanceList
            isId06={isId06}
            styles={styles}
            balances={leaveBalances}
            onEdit={setSelectedBalance}
            onDelete={handleDeleteBalance}
          />
        </>
      )}
    </div>
  );
};

export default LeavePage;

export async function getServerSideProps(context) {
  const { id } = context.query;

  const isId06 = id === '06';

  return {
    props: {
      isId06,
    },
  };
}

// ==================== STYLES ====================

const styles = {
  pageContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '30px',
    textAlign: 'center',
  },
  tabContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: '2px solid #e5e7eb',
    flexWrap: 'wrap',
  },
  tabButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  tabButtonActive: {
    color: '#3b82f6',
    borderBottom: '3px solid #3b82f6',
  },
  filterContainer: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  historyContainer: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '20px',
  },
  subHeading: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '15px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  smallLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
  },
  input: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
  },
  smallInput: {
    padding: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
  },
  select: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#fff',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    resize: 'vertical',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#6b7280',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  leaveAllocationSection: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  leaveGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
  },
  leaveCard: {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },
  leaveCardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '10px',
  },
  leaveInputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  leaveInputField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  balanceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  balanceCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  balanceCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f3f4f6',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
  },
  yearBadge: {
    display: 'inline-block',
    marginTop: '8px',
    padding: '4px 12px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  leaveTypesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  leaveTypeItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  leaveTypeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leaveTypeName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
  },
  leaveTypeStats: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#3b82f6',
  },
  leaveTypeDetail: {
    fontSize: '11px',
    color: '#6b7280',
    margin: 0,
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  balanceAlert: {
    padding: '12px 16px',
    backgroundColor: '#dbeafe',
    border: '1px solid #3b82f6',
    borderRadius: '6px',
    marginBottom: '20px',
  },
  balanceAlertText: {
    margin: 0,
    fontSize: '14px',
    color: '#1e40af',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '2px solid #e5e7eb',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#4b5563',
  },
  employeeName: {
    fontWeight: '600',
    color: '#1f2937',
  },
  employeeId: {
    fontSize: '12px',
    color: '#6b7280',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
    display: 'inline-block',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  approveButton: {
    padding: '6px 12px',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  rejectButton: {
    padding: '6px 12px',
    backgroundColor: '#f59e0b',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  noData: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '40px',
    fontSize: '16px',
  },
};