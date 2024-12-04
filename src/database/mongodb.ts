import mongoose from "mongoose";

const MONGO_URI = process.env.DATABASE_URL || "";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

declare global {
  var mongooseConnection: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

globalThis.mongooseConnection = globalThis.mongooseConnection || { conn: null, promise: null };

async function dbConnect() {
  if (globalThis.mongooseConnection.conn) {
    return globalThis.mongooseConnection.conn;
  }

  if (!globalThis.mongooseConnection.promise) {
    globalThis.mongooseConnection.promise = mongoose
      .connect(MONGO_URI, {
        dbName: "yourDatabaseName",
      })
      .then((mongoose) => mongoose.connection);
  }

  globalThis.mongooseConnection.conn = await globalThis.mongooseConnection.promise;
  return globalThis.mongooseConnection.conn;
}

export default dbConnect;
