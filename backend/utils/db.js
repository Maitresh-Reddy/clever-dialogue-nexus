import dotenv from 'dotenv'
import {MongoClient} from 'mongodb'
const port=process.env.PORT||3000
let client;
let collection;
let otpCollection;
let dataCollection;
let uploadCollection;
let profileCollection;
let Admincollection;
let Employeecollection;


export const initializeDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb+srv://moneyreddy:qTLTFqvNeYRDEw7n@cluster0.uj9y9sa.mongodb.net/";
    
    if (!client) {
      client = new MongoClient(mongoURI, {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
      });
      
      await client.connect();
      console.log("MongoDB connected successfully.");
    }

    if (!collection) {
      const db = client.db("user_info");
      collection = db.collection("users");
      otpCollection = db.collection("otp_tokens");
      dataCollection = db.collection("data");
      uploadCollection = db.collection("uploads");
      profileCollection = db.collection("profiles"); // Initialize profile collection
      Admincollection=db.collection("admin");
      Employeecollection=db.collection("employee");
    }

    client.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    client.on('close', () => {
      console.log('MongoDB connection closed');
      client = null; 
    });

    return { 
      client, 
      collection, 
      otpCollection, 
      dataCollection, 
      uploadCollection, 
      profileCollection,
      Admincollection,
      Employeecollection
    };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};
export const getDB = () => {
  if (!client || !collection || !otpCollection || !dataCollection || !uploadCollection|| !profileCollection|| !Admincollection|| !Employeecollection) {
      throw new Error("Database not initialized. Call initializeDB() first.");
  }
  return { client, collection , otpCollection, dataCollection, uploadCollection,profileCollection,Admincollection};
};

// module.exports = {initializeDB,getDB};