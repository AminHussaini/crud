import connectDB from '../../../utils/db';
import Task from '../../../models/Task';

connectDB();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // const { name, hour, date } = req.body;
      const newTask = new Task(req.body);
      console.log({newTask})
      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}