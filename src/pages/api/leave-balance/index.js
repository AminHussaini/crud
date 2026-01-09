import connectDB from '../../../utils/db';
import LeaveBalance from '../../../models/LeaveBalance';

connectDB();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { employeeId, year } = req.query;
      let query = {};
      
      if (employeeId) query.employeeId = employeeId;
      if (year) query.year = parseInt(year);
      
      const balances = await LeaveBalance.find(query).sort({ year: -1, employeeName: 1 });
      res.status(200).json(balances);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}