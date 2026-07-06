require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://the-black-currant.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization"
  ]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const mongoUrl = process.env.dbURL;

if (!mongoUrl) {
  console.error(" Missing dbURL environment variable");
  process.exit(1);
}

const userRoutes = require("./server/routes/userRoute");
const postRoutes = require("./server/routes/postRoute");
const friendRoutes = require("./server/routes/friendRoute");
const commentRoutes = require("./server/routes/commentRoute");
const profileRoutes = require("./server/routes/profileRoute");

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/friend", friendRoutes);
app.use("/comment", commentRoutes);
app.use("/profile", profileRoutes);

const PORT = process.env.PORT || 3500;

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000
    });

    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB startup failed:", err.message);
    process.exit(1);
  }
}

startServer();