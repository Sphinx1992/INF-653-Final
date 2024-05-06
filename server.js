require("dotenv").config();
const express = require("express");
const app = express();
const corsOptions = require("./config/corsOptions");
const cors = require('cors');
const morgan= require('morgan');
const mongoose = require("mongoose");
const {verifyStateParameter} = require("./middleware/verifyStateParameter.js");
const errorHandler = require("./middleware/errorHandler");
const  {logger}  = require("./middleware/logEvents");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 5000;
const fs = require("fs");
const fsPromises = require("fs").promises;
const http = require("http");







// Import the states route
const statesRoute = require('./routes/StateRoutes');


// Configure routes
app.use('/StateRoutes', statesRoute);

app.use(cors(corsOptions));


//Connect to MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({origin: '*'}));
app.use(morgan('dev'));
app.use(logger);
app.use(verifyStateParameter);

app.use(errorHandler);







mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`Server is listing on port ${PORT}`);
  });
});

