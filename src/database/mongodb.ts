import mongoose from 'mongoose';

const MONGO_URI = process.env.DATABASE_URL || "";
  

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

global.mongoose = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose
      .connect(MONGO_URI, {
        dbName: 'yourDatabaseName',
      })
      .then((mongoose) => mongoose.connection);
  }

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default dbConnect;
