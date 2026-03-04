require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/Auth');
const Ai = require('./routes/Ai')
const Jobs = require('./routes/Jobs')
const dns = require('node:dns/promises');
dns.setServers(['8.8.8.8', '8.8.4.4']);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use(cors()); 
app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database is connected"))
  .catch((err) => console.log("❌ Connection error:", err));


app.use("/api/user", authRoutes);
app.use("/api/jobs",Jobs)
app.use('/api/ai',Ai)
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));