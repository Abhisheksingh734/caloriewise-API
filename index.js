const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// importing model
const userModel = require("./models/userModel");

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

app.listen(8000, () => {
  console.log("Server is up and running");
});
