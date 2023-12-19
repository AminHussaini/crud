// pages/index.js
import React, { useEffect, useState } from 'react';
import TaskEditForm from '../components/TaskEditForm';
import TaskList from '../components/TaskList';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  const handleCreate = async (taskData) => {
    console.log({taskData})
    const res = await fetch('/api/tasks/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (res.ok) {
      const createdTask = await res.json();
      setTasks([...tasks, createdTask]);
      setSelectedTask(null);
    } else {
      console.error('Failed to create task');
    }
  };

  const handleUpdate = async (taskData) => {
    const res = await fetch(`/api/tasks/update/${selectedTask._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (res.ok) {
      const updatedTask = await res.json();
      setTasks(tasks.map((task) => (task._id === selectedTask._id ? updatedTask : task)));
      setSelectedTask(null);
    } else {
      console.error('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    const res = await fetch(`/api/tasks/delete/${taskId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setTasks(tasks.filter((task) => task._id !== taskId));
      setSelectedTask(null);
    } else {
      console.error('Failed to delete task');
    }
  };

  return (
    <div>
      <br />
      {selectedTask ? (
        <TaskEditForm
          onSubmit={handleUpdate}
          initialData={selectedTask}
          onCancel={() => setSelectedTask(null)}
        />
      ) : (
        <TaskEditForm onSubmit={handleCreate} />
      )}
      <TaskList tasks={tasks} onDelete={handleDelete} onEdit={(task) => setSelectedTask(task)} />
    </div>
  );
};

export default Home;
