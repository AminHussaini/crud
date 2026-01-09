import connectDB from '../../../../utils/db';
import Leave from '../../../../models/Leave';

connectDB();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await Leave.findByIdAndDelete(id);
      res.status(200).json({ message: 'Leave deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}