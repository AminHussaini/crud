import connectDB from '../../../../utils/db';
import Task from '../../../../models/Task';

connectDB();

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'PUT') {
    try {
      const { id } = req.query;
      const { hour,date } = req.body;

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { hour,date },
        { new: true }
      );

      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}