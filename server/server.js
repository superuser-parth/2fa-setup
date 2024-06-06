const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const PORT = 4444

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

mongoose
  .connect('mongodb://localhost:27017/ratingMS', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log("Connected to MongoDB Compass"))
  .catch((err) => console.error("Error connecting to MongoDB Compass:", err));

  app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true
  }));
app.use(express.json())

app.use("/api", require("./routes/apiRoutes"));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
  });