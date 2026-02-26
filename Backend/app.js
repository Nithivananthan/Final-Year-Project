
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();

app.use(express.json())


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log(" Connection error:", err));

const port = process.env.PORT

app.listen(port,()=>console.log("server is running"))

