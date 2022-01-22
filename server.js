const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = 3000;

const app = express();

app.use(logger("dev"));

if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// mongoose DB credentials
mongoose.connect(process.env.MONGODB_URI ,{ 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
});


// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
