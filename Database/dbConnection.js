import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const dbConnection = async () => {
  try {
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add any other options you need
    };

    mongoose.connect(process.env.MONGODB_URL, connectionOptions);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

export default dbConnection;
