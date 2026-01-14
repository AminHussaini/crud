const LeaveHistory = ({ leaves, onEdit, onDelete, onApprove, onReject, isAdmin,styles,isId06 }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return '#10b981';
      case 'Rejected': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={styles.historyContainer}>
      <h2 style={styles.heading}>Leave History</h2>
      {leaves.length === 0 ? (
        <p style={styles.noData}>No leave applications found.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Employee</th>
                <th style={styles.th}>Leave Type</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Days</th>
                <th style={styles.th}>Applied Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <div>
                      <div style={styles.employeeName}>{leave.employeeName}</div>
                      <div style={styles.employeeId}>{leave.employeeId}</div>
                    </div>
                  </td>
                  <td style={styles.td}>{leave.leaveType}</td>
                  <td style={styles.td}>
                    {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                  </td>
                  <td style={styles.td}>{leave.totalDays}</td>
                  <td style={styles.td}>{formatDate(leave.appliedDate)}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(leave.status),
                    }}>
                      {leave.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      {leave.status === 'Pending' && isId06 && (
                        <>
                          <button
                            onClick={() => onEdit(leave)}
                            style={styles.editButton}
                          >
                            Edit
                          </button>
                          {isAdmin && isId06 && (
                            <>
                              <button
                                onClick={() => onApprove(leave._id)}
                                style={styles.approveButton}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => onReject(leave._id)}
                                style={styles.rejectButton}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </>
                      )}
                      {
                        isId06 && 
                      <button
                        onClick={() => onDelete(leave._id)}
                        style={styles.deleteButton}
                      >
                        Delete
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;