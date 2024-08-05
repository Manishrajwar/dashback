import mongoose from "mongoose";

export const connectDb = async () => {
  await mongoose
    .connect(process.env.DB, {
      dbName: process.env.DATABASE_URL,
    })
    .then(() => console.log("DATABASE CONNECTED"))
    .catch((e) => console.log("database connection failed", e.message));
};
