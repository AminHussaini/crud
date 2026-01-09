import React, { useState } from 'react';

const LeaveApplicationForm = ({ onSubmit, initialData, onCancel,styles }) => {
  const [formData, setFormData] = useState(initialData || {
    employeeName: '',
    employeeId: '',
    leaveType: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: '',
    totalDays: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'startDate' || name === 'endDate') {
      calculateDays({ ...formData, [name]: value });
    }
  };

  const calculateDays = (data) => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setFormData({ ...data, totalDays: diffDays });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.heading}>{initialData ? 'Edit Leave Application' : 'Apply for Leave'}</h2>
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
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Leave Type *</label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
              <option value="Paternity Leave">Paternity Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Total Days</label>
            <input
              type="number"
              value={formData.totalDays}
              style={styles.input}
              disabled
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Reason *</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            style={styles.textarea}
            rows="4"
            required
          />
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton}>
            {initialData ? 'Update Leave' : 'Submit Application'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} style={styles.cancelButton}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LeaveApplicationForm;