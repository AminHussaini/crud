import LeaveApplicationForm from "@/components/LeaveApplicationForm";
import LeaveBalanceForm from "@/components/LeaveBalanceForm";
import LeaveBalanceList from "@/components/LeaveBalanceList";
import LeaveHistory from "@/components/LeaveHistory";
import React from "react";

const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { bg: '#d1fae5', border: '#10b981', text: '#065f46', icon: '✓' },
    error:   { bg: '#fee2e2', border: '#ef4444', text: '#7f1d1d', icon: '✕' },
    info:    { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', icon: 'ℹ' },
  };
  const c = colors[type] || colors.info;

  return (
    <div style={{
      position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '14px 18px', borderRadius: '10px', maxWidth: '360px', width: '90%',
      backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text,
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)', animation: 'slideIn 0.25s ease',
    }}>
      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{c.icon}</span>
      <span style={{ fontSize: '14px', flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: c.text, opacity: 0.7 }}>×</button>
    </div>
  );
};

const RejectModal = ({ onConfirm, onCancel }) => {
  const [reason, setReason] = React.useState('');
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)', padding: '16px',
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '12px', padding: '28px',
        width: '100%', maxWidth: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>Reject Leave</h3>
        <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#6b7280' }}>Please provide a reason for rejection.</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter rejection reason..."
          rows={3}
          style={{
            width: '100%', padding: '10px', border: '1px solid #d1d5db',
            borderRadius: '8px', fontSize: '14px', resize: 'vertical',
            boxSizing: 'border-box', marginBottom: '16px',
          }}
          autoFocus
        />
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
            Cancel
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim()}
            style={{
              padding: '9px 18px', borderRadius: '8px', border: 'none',
              background: reason.trim() ? '#ef4444' : '#fca5a5',
              color: '#fff', cursor: reason.trim() ? 'pointer' : 'not-allowed',
              fontSize: '14px', fontWeight: '600',
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9998, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', padding: '16px',
  }}>
    <div style={{
      backgroundColor: '#fff', borderRadius: '12px', padding: '28px',
      width: '100%', maxWidth: '380px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    }}>
      <p style={{ margin: '0 0 20px', fontSize: '15px', color: '#374151' }}>{message}</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
          Cancel
        </button>
        <button onClick={onConfirm} style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

const LeavePage = ({ isId06 }) => {
  const [leaves, setLeaves] = React.useState([]);
  const [leaveBalances, setLeaveBalances] = React.useState([]);
  const [selectedLeave, setSelectedLeave] = React.useState(null);
  const [selectedBalance, setSelectedBalance] = React.useState(null);
  const [isAdmin] = React.useState(true);
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [activeTab, setActiveTab] = React.useState('balance');
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [rejectTarget, setRejectTarget] = React.useState(null);
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const hideToast = () => setToast(null);

  React.useEffect(() => {
    fetchLeaves();
    fetchLeaveBalances();
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
    setLoading(true);
    const res = await fetch('/api/leaves/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaveData),
    });
    setLoading(false);
    if (res.ok) {
      const createdLeave = await res.json();
      setLeaves([createdLeave, ...leaves]);
      setSelectedLeave(null);
      showToast('Leave application submitted successfully!');
    } else {
      showToast('Failed to submit leave application.', 'error');
    }
  };

  const handleUpdateLeave = async (leaveData) => {
    setLoading(true);
    const res = await fetch(`/api/leaves/update/${selectedLeave._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaveData),
    });
    setLoading(false);
    if (res.ok) {
      const updatedLeave = await res.json();
      setLeaves(leaves.map((leave) => leave._id === selectedLeave._id ? updatedLeave : leave));
      setSelectedLeave(null);
      showToast('Leave application updated successfully!');
    } else {
      showToast('Failed to update leave application.', 'error');
    }
  };

  const handleDeleteLeave = (leaveId) => setDeleteTarget({ id: leaveId, type: 'leave' });

  const confirmDeleteLeave = async () => {
    const id = deleteTarget.id;
    setDeleteTarget(null);
    const res = await fetch(`/api/leaves/delete/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setLeaves(leaves.filter((leave) => leave._id !== id));
      showToast('Leave application deleted.', 'info');
    } else {
      showToast('Failed to delete leave application.', 'error');
    }
  };

  const handleApprove = async (leaveId) => {
    const res = await fetch(`/api/leaves/update/${leaveId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Approved', approvedBy: 'Admin', approvedDate: new Date() }),
    });
    if (res.ok) {
      fetchLeaves();
      showToast('Leave approved successfully!');
    } else {
      showToast('Failed to approve leave.', 'error');
    }
  };

  const handleReject = (leaveId) => setRejectTarget(leaveId);

  const confirmReject = async (reason) => {
    const id = rejectTarget;
    setRejectTarget(null);
    const res = await fetch(`/api/leaves/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Rejected', rejectionReason: reason, approvedBy: 'Admin', approvedDate: new Date() }),
    });
    if (res.ok) {
      fetchLeaves();
      showToast('Leave rejected.', 'info');
    } else {
      showToast('Failed to reject leave.', 'error');
    }
  };

  const handleCreateBalance = async (balanceData) => {
    setLoading(true);
    const res = await fetch('/api/leave-balance/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(balanceData),
    });
    setLoading(false);
    if (res.ok) {
      const createdBalance = await res.json();
      setLeaveBalances([createdBalance, ...leaveBalances]);
      setSelectedBalance(null);
      showToast('Leave balance added successfully!');
    } else {
      const error = await res.json();
      showToast(error.error || 'Failed to add leave balance.', 'error');
    }
  };

  const handleUpdateBalance = async (balanceData) => {
    setLoading(true);
    const res = await fetch(`/api/leave-balance/update/${selectedBalance._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(balanceData),
    });
    setLoading(false);
    if (res.ok) {
      const updatedBalance = await res.json();
      setLeaveBalances(leaveBalances.map((b) => b._id === selectedBalance._id ? updatedBalance : b));
      setSelectedBalance(null);
      showToast('Leave balance updated successfully!');
    } else {
      showToast('Failed to update leave balance.', 'error');
    }
  };

  const handleDeleteBalance = (balanceId) => setDeleteTarget({ id: balanceId, type: 'balance' });

  const confirmDeleteBalance = async () => {
    const id = deleteTarget.id;
    setDeleteTarget(null);
    const res = await fetch(`/api/leave-balance/delete/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setLeaveBalances(leaveBalances.filter((b) => b._id !== id));
      showToast('Leave balance deleted.', 'info');
    } else {
      showToast('Failed to delete leave balance.', 'error');
    }
  };

  const filteredLeaves = filterStatus === 'all'
    ? leaves
    : leaves.filter((leave) => leave.status === filterStatus);

  const tabs = [
    { key: 'apply', label: 'Apply Leave' },
    { key: 'history', label: 'Leave History' },
    { key: 'balance', label: 'Leave Balance' },
    ...(isAdmin ? [{ key: 'manage', label: 'Manage Balances' }] : []),
  ];

  return (
    <>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @media (max-width: 640px) {
          .leave-page-container { padding: 12px !important; }
          .leave-page-title { font-size: 22px !important; margin-bottom: 16px !important; }
          .leave-tab-container { gap: 4px !important; }
          .leave-tab-btn { padding: 10px 12px !important; font-size: 13px !important; }
          .leave-form-row { grid-template-columns: 1fr !important; gap: 12px !important; }
          .leave-form-container { padding: 16px !important; }
          .leave-filter { flex-direction: column !important; align-items: flex-start !important; }
          .leave-history-container { padding: 16px !important; }
          .leave-table th, .leave-table td { padding: 8px 6px !important; font-size: 12px !important; }
          .leave-action-btns { flex-direction: column !important; }
          .leave-action-btns button { width: 100% !important; text-align: center !important; }
          .leave-balance-grid { grid-template-columns: 1fr !important; }
          .leave-leave-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 400px) {
          .leave-leave-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      {rejectTarget && <RejectModal onConfirm={confirmReject} onCancel={() => setRejectTarget(null)} />}
      {deleteTarget && (
        <ConfirmModal
          message="Are you sure you want to delete this? This action cannot be undone."
          onConfirm={deleteTarget.type === 'leave' ? confirmDeleteLeave : confirmDeleteBalance}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="leave-page-container" style={styles.pageContainer}>
        <h1 className="leave-page-title" style={styles.pageTitle}>Leave Management System</h1>

        <div className="leave-tab-container" style={styles.tabContainer}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className="leave-tab-btn"
              onClick={() => setActiveTab(tab.key)}
              style={{ ...styles.tabButton, ...(activeTab === tab.key ? styles.tabButtonActive : {}) }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '12px', color: '#6b7280', fontSize: '14px' }}>
            Processing...
          </div>
        )}

        {activeTab === 'apply' && (
          <LeaveApplicationForm
            styles={{ ...styles, row: { ...styles.row, className: 'leave-form-row' } }}
            isId06={isId06}
            onSubmit={selectedLeave ? handleUpdateLeave : handleCreateLeave}
            initialData={selectedLeave}
            onCancel={selectedLeave ? () => setSelectedLeave(null) : undefined}
            leaveBalances={leaveBalances}
            rowClassName="leave-form-row"
          />
        )}

        {activeTab === 'history' && (
          <>
            <div className="leave-filter" style={styles.filterContainer}>
              <label style={styles.label}>Filter by Status:</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.select}>
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
              onEdit={(leave) => { setSelectedLeave(leave); setActiveTab('apply'); }}
              onDelete={handleDeleteLeave}
              onApprove={handleApprove}
              onReject={handleReject}
              isAdmin={isAdmin}
            />
          </>
        )}

        {activeTab === 'balance' && (
          <>
            <div className="leave-filter" style={styles.filterContainer}>
              <label style={styles.label}>Year:</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} style={styles.select}>
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
            <LeaveBalanceForm
              isId06={isId06}
              styles={styles}
              onSubmit={selectedBalance ? handleUpdateBalance : handleCreateBalance}
              initialData={selectedBalance}
              onCancel={selectedBalance ? () => setSelectedBalance(null) : undefined}
            />
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
    </>
  );
};

export default LeavePage;

export async function getServerSideProps(context) {
  const { id } = context.query;
  return { props: { isId06: id === '06' } };
}

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
    whiteSpace: 'nowrap',
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
    flexWrap: 'wrap',
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
    width: '100%',
    boxSizing: 'border-box',
  },
  smallInput: {
    padding: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    width: '100%',
    boxSizing: 'border-box',
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
    width: '100%',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
    flexWrap: 'wrap',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
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
    flexShrink: 0,
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
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '560px',
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
    whiteSpace: 'nowrap',
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
    whiteSpace: 'nowrap',
  },
  actionButtons: {
    display: 'flex',
    gap: '6px',
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
    whiteSpace: 'nowrap',
  },
  approveButton: {
    padding: '6px 12px',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  rejectButton: {
    padding: '6px 12px',
    backgroundColor: '#f59e0b',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  noData: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '40px',
    fontSize: '16px',
  },
};
