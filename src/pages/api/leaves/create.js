import connectDB from '../../../utils/db';
import Leave from '../../../models/Leave';

connectDB();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const newLeave = new Leave(req.body);
      const savedLeave = await newLeave.save();
      res.status(201).json(savedLeave);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}