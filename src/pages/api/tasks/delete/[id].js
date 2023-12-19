// pages/api/tasks/delete/[id].js
import connectDB from '../../../../utils/db';
import Task from '../../../../models/Task';

connectDB();

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'DELETE') {
    try {
      const { id } = req.query;

      await Task.findByIdAndDelete(id);

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}