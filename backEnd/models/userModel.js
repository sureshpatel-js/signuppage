const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide your name."],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please provide a Email."],
  },
  phoneNumber: {
    type: Number,
  },
  password: {
    type: String,
    required: [true, "Please provide a Password."],
    select: false,
  },
  dateOfBirth: {
    type: String,
    required: [true, "Please provide your Date of birth."],
  },
  profileUrl: {
    type: String,
    required: [true, "Please provide a Profile image."],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
