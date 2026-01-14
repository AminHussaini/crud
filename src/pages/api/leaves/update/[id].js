// pages/api/leaves/update/[id].js
import connectDB from '../../../../utils/db';
import Leave from '../../../../models/Leave';
import LeaveBalance from '../../../../models/LeaveBalance';

connectDB();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const leave = await Leave.findById(id);
      const updatedLeave = await Leave.findByIdAndUpdate(id, req.body, { new: true });
      
      // If status changed to Approved, deduct from leave balance
      if (req.body.status === 'Approved' && leave.status !== 'Approved') {
        const currentYear = new Date(leave.startDate).getFullYear();
        const balance = await LeaveBalance.findOne({ 
          employeeId: leave.employeeId, 
          year: currentYear 
        });
        
        if (balance) {
          const leaveTypeKey = leave.leaveType.replace(/\s/g, '');
          const leaveTypeKeyLower = leaveTypeKey.charAt(0).toLowerCase() + leaveTypeKey.slice(1);
          
          if (balance.leaveAllocations[leaveTypeKeyLower]) {
            balance.leaveAllocations[leaveTypeKeyLower].used += leave.totalDays;
            balance.leaveAllocations[leaveTypeKeyLower].remaining = 
              balance.leaveAllocations[leaveTypeKeyLower].total - 
              balance.leaveAllocations[leaveTypeKeyLower].used;
            
            await balance.save();
          }
        }
      }
      
      // If status changed from Approved to Rejected/Pending, add back to balance
      if (leave.status === 'Approved' && req.body.status !== 'Approved') {
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
      
      res.status(200).json(updatedLeave);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}