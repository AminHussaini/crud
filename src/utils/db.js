import mongoose from 'mongoose';
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_DB}`);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;