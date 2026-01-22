import mongoose from "mongoose";

type connectionObject = {
  isConnected?: boolean;
};

var connection: connectionObject = {};

async function ConnectToDB(): Promise<void> {
  if (connection.isConnected) {
    return;
  }

  try {
    const URI = process.env.MONGODB_URI;
    if (!URI) throw new Error("MONGO_DB URI is undefined");
    const DB = await mongoose.connect(URI);
    if(DB.connections[0].readyState === 1){
        connection.isConnected = true;
    }
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("Error in connecting to DB", error);
    throw error
  }
}

export default ConnectToDB;
