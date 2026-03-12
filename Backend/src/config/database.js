import mongoose from "mongoose";

/**
 * Connect to MongoDB using MONGO_URI from environment.
 * Logs on success; exits process on failure.
 */
export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not set in environment.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected.");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message || err);
    process.exit(1);
  }
}
