// components/TaskList.js
import React from "react";
import styles from "../styles/TaskList.module.css"; // Import your CSS module

const TaskList = ({ tasks, onDelete, onEdit,isId06 }) => {
  const frondTasks = tasks.filter((task) => task.name === "front");
  const backTasks = tasks.filter((task) => task.name === "back");

  const calculateTotalHours = (taskArray) => {
    const totalHours = taskArray.reduce((total, task) => {
      // Split the hour string into hours and minutes
      const [hours, minutes] = task.hour.split(':').map(Number);
      // Convert hours and minutes to a total number of hours
      return total + hours + minutes / 60;
    }, 0);
  
    // Check if totalHours is a valid number
    if (isNaN(totalHours)) {
      return "Invalid total";
    }
  
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
  
    // Format hours and minutes as "hh:mm"
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}`;
  };

  const totalFrondHours = calculateTotalHours(frondTasks);
  const totalBackHours = calculateTotalHours(backTasks);

  return (
    <div className={styles.taskListContainer}>
      <div className={styles.taskSection}>
        <h2 style={{ marginBottom: "10px" }}>
          Front Tasks - Total Hours: {totalFrondHours}
        </h2>
        <ul className={styles.taskUl}>
          {frondTasks.map((task) => (
            <li key={task._id} className={styles.taskLi}>
              <div className={styles.taskInfoContainer}>
                <span className={styles.taskInfoLabel}>Hour:</span>
                <span className={styles.taskInfoValue}>{task.hour}</span>
              </div>
              {task.date && (
                <div className={styles.taskInfoContainer}>
                  <span className={styles.taskInfoLabel}>Date:</span>
                  <span className={styles.taskInfoValue}>{task.date}</span>
                </div>
              )}
              <div className={styles.taskButtonContainer}>
                {isId06 && <>
                  <button
                    className={styles.taskButton}
                    onClick={() => onDelete(task._id)}
                  >
                    Delete
                  </button>
                  <button
                    className={styles.taskButton}
                    onClick={() => onEdit(task)}
                  >
                    Edit
                  </button>
                  </>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.taskSection}>
        <h2 style={{ marginBottom: "10px" }}>
          Back Tasks - Total Hours: {totalBackHours}
        </h2>
        <ul className={styles.taskUl}>
          {backTasks.map((task) => (
            <li key={task._id} className={styles.taskLi}>
              <div className={styles.taskInfoContainer}>
                <span className={styles.taskInfoLabel}>Hour:</span>
                <span className={styles.taskInfoValue}>{task.hour}</span>
              </div>
              {task.date && (
                <div className={styles.taskInfoContainer}>
                  <span className={styles.taskInfoLabel}>Date:</span>
                  <span className={styles.taskInfoValue}>{task.date}</span>
                </div>
              )}
              <div className={styles.taskButtonContainer}>
                <button
                  className={styles.taskButton}
                  onClick={() => onDelete(task._id)}
                >
                  Delete
                </button>
                <button
                  className={styles.taskButton}
                  onClick={() => onEdit(task)}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskList;
