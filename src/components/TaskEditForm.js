// components/TaskEditForm.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/TaskEditForm.module.css'; // Adjust the path based on your project structure

const TaskEditForm = ({ onSubmit, initialData, onCancel }) => {
  const [name, setName] = useState(initialData ? initialData.name : '');
  const [hour, setHour] = useState(initialData ? initialData.hour : '');
  const [date, setDate] = useState(initialData ? initialData.date : '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setHour(initialData.hour);
      setDate(initialData.date);
    }
  }, [initialData]);

  const isValidTimeFormat = (timeString) => {
    const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // if (!name || !hour || !date || !isValidTimeFormat(hour)) {
    if (!name || !hour || !date) {
      alert('Please fill in all fields');
      return;
    }
    if (!isValidTimeFormat(hour)) {
      alert('Invalid time');
      return;
    }
    let pass = "";
    pass = name == "front" ? "demo321" : "testing123"; 

    onSubmit({ name, hour, date, pass });
    setName('');
    setHour('');
    setDate('');
  };

  return (
    <form className={styles.taskEditForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Name:</label>
        <select className={styles.selectInput} value={name} onChange={(e) => setName(e.target.value)}>
          <option value="" disabled>Select</option>
          <option value="front">Front</option>
          <option value="back">Back</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Hour:</label>
        <input className={styles.selectInput} type="text" value={hour} onChange={(e) => setHour(e.target.value)} step="300" />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Date:</label>
        <input className={styles.selectInput} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className={styles.buttonGroup}>
        {/* Use the new local class for the button */}
        <button className={styles.button} type="submit">{initialData ? 'Update' : 'Create'}</button>
        {initialData && <button type="button" className={styles.button} onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

export default TaskEditForm;
