const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    role: { type: String, enum: ["admin", "junior", "senior", "pending"]},
    image: String,
    gitHubUrl: String
  }
);

const User = model("User", userSchema);

module.exports = User;
