const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// importing model
const userModel = require("./models/userModel");
const foodModel = require("./models/foodModel");

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

// middleware
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
    // console.log(foods);
    res.status(201).send(foods);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ message: "Some problem with getting info of foods" });
  }
});

//middleware

function verifyToken(req, res, next) {
  if (req.headers.authorization !== undefined) {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "nutrify", (err, data) => {
      if (!err) {
        next();
      } else {
        res.status(403).send({ message: "Invalid token" });
      }
    });
  } else {
    res.send({ message: "Please send auth token" });
  }
}

app.listen(8000, () => {
  console.log("Server is up and running");
});
