require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 5000;

//Connect to MongoDB
connectDB();



mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`Server is listing on port ${PORT}`);
  });
});

