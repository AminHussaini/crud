import connectDB from '../../../utils/db';
import Leave from '../../../models/Leave';

connectDB();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { employeeId, status } = req.query;
      let query = {};
      
      if (employeeId) query.employeeId = employeeId;
      if (status) query.status = status;
      
      const leaves = await Leave.find(query).sort({ appliedDate: -1 });
      res.status(200).json(leaves);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}