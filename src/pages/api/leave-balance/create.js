import connectDB from '../../../utils/db';
import LeaveBalance from '../../../models/LeaveBalance';

connectDB();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { employeeId, year } = req.body;
      
      // Check if balance already exists for this employee and year
      const existing = await LeaveBalance.findOne({ employeeId, year });
      if (existing) {
        return res.status(400).json({ error: 'Leave balance already exists for this employee and year' });
      }
      
      const newBalance = new LeaveBalance(req.body);
      const savedBalance = await newBalance.save();
      res.status(201).json(savedBalance);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}