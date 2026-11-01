import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI is not defined in your environment variables (.env).');
    console.warn('Please configure your MongoDB Atlas connection string.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection disconnected.');
  });
}
