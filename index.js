const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// importing model
const userModel = require("./models/userModel");
const foodModel = require("./models/foodModel");
const trackingModel = require("./models/trackingModel");
const verifyToken = require("./verifyToken");

// db connection
mongoose
  .connect("mongodb://localhost:27017/nutrify")
  .then(() => {
    console.log("db connection successfull");
  })
  .catch((err) => {
    console.log(err);
  });

//express obj
const app = express();

// middleware to convert to json
app.use(express.json());

// endpoint for registering user
app.post("/register", (req, res) => {
  let user = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    if (!err) {
      bcrypt.hash(user.password, salt, async (err, hpass) => {
        if (!err) {
          user.password = hpass;
          try {
            let doc = await userModel.create(user);
            res.status(201).send({ message: "User registered" });
          } catch (err) {
            console.log(err);
            res.status(500).send({ message: "Some Probelm" });
          }
        }
      });
    }
  });
});

//end point for login request
app.post("/login", async (req, res) => {
  let userCred = req.body;

  try {
    //get the user from db
    const user = await userModel.findOne({ email: userCred.email });

    //check if user is present
    if (user != null) {
      bcrypt.compare(userCred.password, user.password, (err, success) => {
        if (success) {
          jwt.sign({ email: userCred.email }, "nutrify", (err, token) => {
            if (!err) {
              res.send({ message: "Login success", token: token });
            }
          });
        } else {
          res.status(403).send({ message: "Incorrect password" });
        }
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status().send({ message: "Some problem" });
  }
});

// end point to see all food
app.get("/foods", verifyToken, async (req, res) => {
  try {
    let foods = await foodModel.find();

    res.status(201).send(foods);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ message: "Some problem with getting info of foods" });
  }
});

//search food by name
app.get("/foods/:name", verifyToken, async (req, res) => {
  try {
    let foods = await foodModel.find({
      name: { $regex: req.params.name, $options: "i" },
    });

    if (foods.length !== 0) {
      res.status(201).send(foods);
    } else {
      res.status(404).send({ message: "Food item not found" });
    }
  } catch (e) {
    console.log(err);
    res.status(500).send({ message: "Some problem with getting food name" });
  }
});

// endpoint to track a food
app.post("/track", verifyToken, async (req, res) => {
  const trackData = req.body;
  try {
    let data = await trackingModel.create(trackData);

    res.status(201).send({ message: "Food added" });
  } catch (e) {
    console.log(e);
    res.status(500).send("Some problem with tracking data");
  }
});

// end point to fetch all foods eaten by a person

app.get("/track/:userId/:date", verifyToken, async (req, res) => {
  let userid = req.params.userId;
  let date = new Date(req.params.date).toLocaleDateString();

  console.log(date);

  try {
    let foods = await trackingModel
      .find({ userId: userid, eatenDate: date })
      .populate("userId")
      .populate("foodId");
    res.status(201).send(foods);
  } catch (e) {
    console.log(e);
    res.status(500).send("Some problem with tracking data");
  }
});

app.listen(8000, () => {
  console.log("Server is up and running");
});
