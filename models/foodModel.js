// const { name } = require("ejs");
const mongoose = require("mongoose");

const foodSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    calories: {
      type: Number,
      require: true,
    },
    protein: {
      type: Number,
      require: true,
    },
    fat: {
      type: Number,
      require: true,
    },
    fiber: {
      type: Number,
      require: true,
    },
    carbohydrates: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

const foodModel = mongoose.model("foods", foodSchema);

module.exports = foodModel;
