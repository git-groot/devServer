import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const dbconnect = async (retryCount = 0) => {
    try {
        console.log(`Connecting to MongoDB (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/devserve", {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log("✅ MongoDB connected successfully");
    } catch (err) {
        console.error(`❌ MongoDB connection error (attempt ${retryCount + 1}):`, err.message);
        
        if (retryCount < MAX_RETRIES - 1) {
            console.log(`⏳ Retrying in ${RETRY_DELAY/1000}s...`);
            setTimeout(() => dbconnect(retryCount + 1), RETRY_DELAY);
        } else {
            console.error("💥 Max retries reached. Please check your MongoDB connection.");
            console.error("Tip: Verify your MongoDB Atlas cluster is running and network access is configured.");
            process.exit(1);
        }
    }
};

// Connection event listeners
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('🚨 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB');
});

export default dbconnect;