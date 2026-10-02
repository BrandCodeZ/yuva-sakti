import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
  mongoose.set("strictQuery", true);

  await mongoose.connect(process.env.MONGODB_URI ?? "", {
    serverSelectionTimeoutMS: 8_000,
    maxPoolSize: 10,
  });

  mongoose.connection.on("error", (error) => {
    console.error("[db] connection error:", error.message);
  });

  console.log("[db] connected");
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
}
