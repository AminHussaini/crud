import connectDB from '../../../../utils/db';
import LeaveBalance from '../../../../models/LeaveBalance';

connectDB();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const updatedBalance = await LeaveBalance.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updatedBalance);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}