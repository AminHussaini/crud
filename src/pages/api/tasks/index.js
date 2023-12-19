import connectDB from '../../../utils/db';
import Task from '../../../models/Task';

connectDB();

export default async function handler(req, res) {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}