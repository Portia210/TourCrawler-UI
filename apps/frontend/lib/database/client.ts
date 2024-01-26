import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Please define the DATABASE_URL environment variable");
}

let cachedConnection: any = null;

const connectMongoDB = async (): Promise<typeof mongoose> => {
  if (cachedConnection) return cachedConnection;
  try {
    const connection = await mongoose.connect(DATABASE_URL);
    console.log(`Connected to MongoDB`);
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default connectMongoDB;
