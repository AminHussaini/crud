// models/Leave.js
import mongoose from 'mongoose';

const LeaveSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  leaveType: {
    type: String,
    required: true,
    enum: ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave'],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  approvedBy: {
    type: String,
  },
  approvedDate: {
    type: Date,
  },
  rejectionReason: {
    type: String,
  },
  totalDays: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Leave || mongoose.model('Leave', LeaveSchema);