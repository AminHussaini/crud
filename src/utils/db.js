import mongoose from 'mongoose';
require('dotenv').config();

const connectDB = async () => {
  console.log(process.env.MONGO_DB)
  try {
    await mongoose.connect(`${process.env.MONGO_DB}`);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;