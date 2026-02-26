const express = require('express')

const mongoose = require('mongoose')

const cors =require('cors')

require('dotenv').config

const app = express();


app.use(express.json())


const Port = process.env.Port;

app.listen(Port,()=>console.log('Application is running successfully'));