const { Schema, model } = require("mongoose");


const reviewSchema = new Schema(
    {        
      description: {
        type: String,
        required: false,
      },
      rating: {
        type: Number,
        required: true,
      }
    }
);

const Review = model("Review", reviewSchema);

module.exports = Review;