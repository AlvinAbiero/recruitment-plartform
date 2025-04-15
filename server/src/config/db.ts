import mongoose from "mongoose";
import config from "./config";

const connectDb = async () => {
  try {
    await mongoose.connect(config.MONGO_URI as string);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Database connection error", err.message);
    process.exit(1);
  }
};

export default connectDb;
