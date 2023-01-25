// get .env vars
require("dotenv").config();

// Import Dependencies
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const { PORT, DATABASE_URL } = process.env;

// Create our app object
const app = express();

// DATABASE CONNECTION
mongoose.connect(DATABASE_URL);

// Connection Events
mongoose.connection
  .on("open", () => {
    console.log("You are connected to mongodb");
  })
  .on("close", () => {
    console.log("You are disconnected");
  })
  .on("error", (error) => {
    console.log(error);
  });

// MODEL
const SnowpadSchema = new mongoose.Schema({
  name: String,
  info: String,
  price: Number,
  image: String,
});

const Snowpad = mongoose.model("Snowpad", SnowpadSchema);

// set up middleware
app.use(cors()); // prevents cross origin resource sharing errors, allows access to server from all origins i.e. react frontend
app.use(morgan("dev")); // logs details of all server hits to terminal
app.use(express.json()); // parse json bodies from request
app.use(express.urlencoded({ extended: false })); // to use URL encoded

// ROUTES - IDUC

app.get("/", (req, res) => {
  res.send("hello world");
});

// INDEX
app.get("/snowpad", async (req, res) => {
  try {
    res.status(200).json(await Snowpad.find({}));
  } catch (error) {
    res.status(400).json(error);
  }
});

// DELETE
app.delete("/snowpad/:id", async (req, res) => {
  try {
    res.status(200).json(await Snowpad.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

// UPDATE
app.put("/snowpad/:id", async (req, res) => {
  try {
    res
      .status(200)
      .json(
        await Snowpad.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
  } catch (error) {
    res.status(400).json(error);
  }
});

// CREATE
app.post("/snowpad", async (req, res) => {
    try {
      res.status(200).json(await Snowpad.create(req.body));
    } catch (error) {
      res.status(400).json(error);
    }
  });

//turn on the server listener
app.listen(PORT, () => console.log(`Listening on ${PORT} `));
