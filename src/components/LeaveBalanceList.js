const LeaveBalanceList = ({ balances, onEdit, onDelete,styles }) => {
  const getProgressPercentage = (used, total) => {
    if (total === 0) return 0;
    return (used / total) * 100;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#ef4444';
    if (percentage >= 50) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={styles.historyContainer}>
      <h2 style={styles.heading}>Leave Balance Overview</h2>
      {balances.length === 0 ? (
        <p style={styles.noData}>No leave balances found.</p>
      ) : (
        <div style={styles.balanceGrid}>
          {balances.map((balance) => (
            <div key={balance._id} style={styles.balanceCard}>
              <div style={styles.balanceCardHeader}>
                <div>
                  <h3 style={styles.employeeName}>{balance.employeeName}</h3>
                  <p style={styles.employeeId}>{balance.employeeId}</p>
                  <p style={styles.yearBadge}>Year: {balance.year}</p>
                </div>
                <div style={styles.cardActions}>
                  <button
                    onClick={() => onEdit(balance)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(balance._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div style={styles.leaveTypesList}>
                {Object.entries(balance.leaveAllocations).map(([key, value]) => {
                  const percentage = getProgressPercentage(value.used, value.total);
                  return (
                    <div key={key} style={styles.leaveTypeItem}>
                      <div style={styles.leaveTypeHeader}>
                        <span style={styles.leaveTypeName}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span style={styles.leaveTypeStats}>
                          {value.remaining}/{value.total} days
                        </span>
                      </div>
                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${percentage}%`,
                            backgroundColor: getProgressColor(percentage),
                          }}
                        />
                      </div>
                      <p style={styles.leaveTypeDetail}>
                        Used: {value.used} days
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveBalanceList;