// pages/api/leaves/delete/[id].js
import connectDB from '../../../../utils/db';
import Leave from '../../../../models/Leave';
import LeaveBalance from '../../../../models/LeaveBalance';

connectDB();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const leave = await Leave.findById(id);
      
      // If approved leave is deleted, add days back to balance
      if (leave && leave.status === 'Approved') {
        const currentYear = new Date(leave.startDate).getFullYear();
        const balance = await LeaveBalance.findOne({ 
          employeeId: leave.employeeId, 
          year: currentYear 
        });
        
        if (balance) {
          const leaveTypeKey = leave.leaveType.replace(/\s/g, '');
          const leaveTypeKeyLower = leaveTypeKey.charAt(0).toLowerCase() + leaveTypeKey.slice(1);
          
          if (balance.leaveAllocations[leaveTypeKeyLower]) {
            balance.leaveAllocations[leaveTypeKeyLower].used -= leave.totalDays;
            balance.leaveAllocations[leaveTypeKeyLower].remaining = 
              balance.leaveAllocations[leaveTypeKeyLower].total - 
              balance.leaveAllocations[leaveTypeKeyLower].used;
            
            await balance.save();
          }
        }
      }
      
      await Leave.findByIdAndDelete(id);
      res.status(200).json({ message: 'Leave deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}