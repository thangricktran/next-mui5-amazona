import mongoose from 'mongoose';

const connection = {};

async function connect() {
  if (connection.isConnected) {
    console.log("Local Mongo DB is already connected!");
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("Mongo DB will use previous connection.");
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
  console.log("Mongo DB uses new connection.");
  connect.isConnected = db.connections[0].readyState;
};

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("Mongo DB is NOT disconnected in development mode.");
    }
  }
};

function convertDocToObject(doc) {
  // console.log("utils/db.js convertDocToObject(doc) doc: \n", doc );
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();

  return doc;
};

const db = { connect, disconnect, convertDocToObject };
export default db;
