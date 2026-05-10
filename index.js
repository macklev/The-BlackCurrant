require('dotenv').config();
const express = require("express")
const app = express()

app.use(express.json())
app.use(express.static("public"))

const userRoutes = require("./server/routes/userRoute")
const postRoutes = require("./server/routes/postRoute")

//CORS middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");  
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");  
  next();
});

app.use("/user", userRoutes)
app.use("/post", postRoutes)
const PORT = process.env.PORT || 3500

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!!`))