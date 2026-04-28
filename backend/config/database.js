const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });

const connectDB = async () => {
  try {
    console.log("====================================");
    console.log("ACTUAL MONGODB_URI BEING USED:");
    console.log(process.env.MONGODB_URI);
    console.log("====================================");

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected Successfully");
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    return conn;

  } catch (error) {

    console.error("❌ MongoDB Connection Failed");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);

    if (error.code) {
      console.error("Error Code:", error.code);
    }

    if (error.message.includes("ENOTFOUND")) {
      console.error("DNS Resolution Failed.");
      console.error("This usually means the cluster hostname is incorrect.");
    }

    if (error.message.includes("bad auth")) {
      console.error("Authentication Failed.");
      console.error("Check username, password, and URL encoding.");
    }

    process.exit(1);
  }
};

module.exports = connectDB;
