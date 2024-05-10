require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
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
const StateRoutes = require("./routes/api/StateRoutes");



// Configure routes

app.use(logger);
app.use(cors(corsOptions));


//Connect to MongoDB
connectDB();



app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({origin: '*'}));
app.use(morgan('dev'));









// API router
app.use("/StateRoutes", require("./routes/api/StateRoutes"));

// 404 route for un-defined
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

// Route Handlers
app.use("/", require("./routes/root"));
app.use("/", require("./routes/subdir"));



app.use(errorHandler);







mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`Server is listing on port ${PORT}`);
  });
});

