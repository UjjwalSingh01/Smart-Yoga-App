import mongoose from 'mongoose';

// Load environment variable or use fallback
const MONGO_URI =
  "mongodb+srv://dragneeln949:2Fk4sZpZOOl3rXvd@cluster0.trjr5.mongodb.net/?retryWrites=true&w=majority&tls=true";

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

// Add a type declaration for global.mongoose
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

// Use a cached global variable to prevent multiple connections in development
global.mongoose = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose
      .connect(MONGO_URI, {
        // ConnectOptions no longer needs `useNewUrlParser` or `useUnifiedTopology`
        dbName: 'yourDatabaseName', // Add your database name here
      })
      .then((mongoose) => mongoose.connection);
  }

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default dbConnect;
