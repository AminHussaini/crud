import React from "react";

// components/LeaveBalanceForm.js
const LeaveBalanceForm = ({ onSubmit, initialData, onCancel, styles, isId06 }) => {
  const [formData, setFormData] = React.useState(
    initialData ? {
      employeeName: initialData.employeeName || '',
      employeeId: initialData.employeeId || '',
      year: initialData.year || new Date().getFullYear(),
      leaveAllocations: initialData.leaveAllocations || {
        sickLeave: { total: 10, used: 0, remaining: 10 },
        casualLeave: { total: 10, used: 0, remaining: 10 },
        annualLeave: { total: 20, used: 0, remaining: 20 },
        maternityLeave: { total: 90, used: 0, remaining: 90 },
        paternityLeave: { total: 10, used: 0, remaining: 10 },
        unpaidLeave: { total: 0, used: 0, remaining: 0 },
      },
    } : {
      employeeName: '',
      employeeId: '',
      year: new Date().getFullYear(),
      leaveAllocations: {
        sickLeave: { total: 10, used: 0, remaining: 10 },
        casualLeave: { total: 10, used: 0, remaining: 10 },
        annualLeave: { total: 20, used: 0, remaining: 20 },
        maternityLeave: { total: 90, used: 0, remaining: 90 },
        paternityLeave: { total: 10, used: 0, remaining: 10 },
        unpaidLeave: { total: 0, used: 0, remaining: 0 },
      },
    }
  );

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        employeeName: initialData.employeeName || '',
        employeeId: initialData.employeeId || '',
        year: initialData.year || new Date().getFullYear(),
        leaveAllocations: initialData.leaveAllocations || {
          sickLeave: { total: 10, used: 0, remaining: 10 },
          casualLeave: { total: 10, used: 0, remaining: 10 },
          annualLeave: { total: 20, used: 0, remaining: 20 },
          maternityLeave: { total: 90, used: 0, remaining: 90 },
          paternityLeave: { total: 10, used: 0, remaining: 10 },
          unpaidLeave: { total: 0, used: 0, remaining: 0 },
        },
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLeaveChange = (leaveType, field, value) => {
    const numValue = parseInt(value) || 0;
    const updatedAllocations = { ...formData.leaveAllocations };
    updatedAllocations[leaveType] = { ...updatedAllocations[leaveType] };
    updatedAllocations[leaveType][field] = numValue;

    if (field === 'total' || field === 'used') {
      updatedAllocations[leaveType].remaining =
        updatedAllocations[leaveType].total - updatedAllocations[leaveType].used;
    }

    setFormData({ ...formData, leaveAllocations: updatedAllocations });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const leaveTypes = [
    { key: 'sickLeave', label: 'Sick Leave' },
    { key: 'casualLeave', label: 'Casual Leave' },
    { key: 'annualLeave', label: 'Annual Leave' },
    { key: 'maternityLeave', label: 'Maternity Leave' },
    { key: 'paternityLeave', label: 'Paternity Leave' },
    { key: 'unpaidLeave', label: 'Unpaid Leave' },
  ];

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.heading}>
        {initialData ? 'Edit Leave Balance' : 'Add Yearly Leave Balance'}
      </h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Employee Name *</label>
            <input
              type="text"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Employee ID *</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              style={styles.input}
              required
              disabled={!!initialData}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Year *</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            style={styles.input}
            min="2020"
            max="2050"
            required
            disabled={!!initialData}
          />
        </div>

        <div style={styles.leaveAllocationSection}>
          <h3 style={styles.subHeading}>Leave Allocations</h3>
          <div style={styles.leaveGrid}>
            {leaveTypes.map(({ key, label }) => (
              <div key={key} style={styles.leaveCard}>
                <h4 style={styles.leaveCardTitle}>{label}</h4>
                <div style={styles.leaveInputGroup}>
                  <div style={styles.leaveInputField}>
                    <label style={styles.smallLabel}>Total Days</label>
                    <input
                      type="number"
                      value={formData.leaveAllocations[key]?.total || 0}
                      onChange={(e) => handleLeaveChange(key, 'total', e.target.value)}
                      style={styles.smallInput}
                      min="0"
                    />
                  </div>
                  <div style={styles.leaveInputField}>
                    <label style={styles.smallLabel}>Used</label>
                    <input
                      type="number"
                      value={formData.leaveAllocations[key]?.used || 0}
                      onChange={(e) => handleLeaveChange(key, 'used', e.target.value)}
                      style={styles.smallInput}
                      min="0"
                    />
                  </div>
                  <div style={styles.leaveInputField}>
                    <label style={styles.smallLabel}>Remaining</label>
                    <input
                      type="number"
                      value={formData.leaveAllocations[key]?.remaining || 0}
                      style={styles.smallInput}
                      disabled
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {isId06 && <>

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitButton}>
              {initialData ? 'Update Balance' : 'Add Leave Balance'}
            </button>
            {onCancel && (
              <button type="button" onClick={onCancel} style={styles.cancelButton}>
                Cancel
              </button>
            )}

          </div>
        </>}
      </form>
    </div>
  );
};

export default LeaveBalanceForm;