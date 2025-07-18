import mongoose from "mongoose";

export const connectDatabase = async ():Promise<void>=>{
    try{
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/users';

        await mongoose.connect(mongoUri,{
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        })

        console.log('Connected to mongo-db successfully')
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Exit process with failure
        process.exit(1);
    }
};

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});