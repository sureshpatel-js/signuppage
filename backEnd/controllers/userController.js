const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
//Constants and functions for json web token
const JWT_SECRET =
  "dlkslvs0vsvlsv-vsovsodv-vkdvndov-LHQPP-ALDDPAF-WFJOWFF-KNSLC";

JWT_EXPIRES_IN = "90d";
const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

//Function to Hash password
const hash = async (plainPassword) => {
  const hashPassword = await bcrypt.hash(plainPassword, 12);
  return hashPassword;
};
//Function to comapre password.

const comparePassword = async (plainPassword, dbPassword) => {
  return await bcrypt.compare(plainPassword, dbPassword);
};

/*=================================================================================================*/
///////////SIGNUP FUNCTION///////////////////
exports.signUp = async (req, res) => {
  try {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: await hash(req.body.password),
      dateOfBirth: req.body.dateOfBirth,
      profileUrl: req.body.profileUrl,
    });
    const token = signToken(newUser._id);
    res.status(201).json({
      ststus: "success",
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(400).json({
      ststus: "fail",
      message: error.message,
    });
  }
};
//================================================SIGNIN FUNCTION==================================

exports.signIn = async (req, res) => {
  //Checking if email and password exist in body.
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      status: "fail",
      message: "Please provide email and password.",
    });
    return;
  }
  try {
    //Checking if user exist and password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await comparePassword(password, user.password))) {
      res.status(401).json({
        status: "fail",
        message: "Incorrect email or password.",
      });
      return;
    }

    // If every thing is ok send the token.
    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
//===============================================UPDATE PASSWORD FUNCTION=========================================
exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body.pass;
  console.log(oldPassword, newPassword);
  if (!oldPassword || !newPassword) {
    res.status(400).json({
      status: "fail",
      message: "Please provide Old password and New password.",
    });
    return;
  }

  try {
    const user = await User.findOne({ _id: req.user._id }).select("+password");

    if (!(await comparePassword(oldPassword, user.password))) {
      res.status(401).json({
        status: "fail",
        message: "Please provide a valid password.",
      });
      return;
    }
    user.password = await hash(newPassword);
    user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      message: "Password changed successfully.",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
//=====================================UPDATE USER FUNCTION=======================================

exports.updateUser = async (req, res) => {
  const obj = req.body;
  if (obj.hasOwnProperty("email") || obj.hasOwnProperty("password")) {
    res.status(400).json({
      status: "fail",
      message: "You cannot update email and password.",
    });
    return;
  }

  try {
    await User.findByIdAndUpdate({ _id: req.user._id }, req.body, {
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      message: "Updated successfully.",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

//========================================GET USER FUNCTION======================================
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
//=====================================FUNCTION TO DELETE USER DETAIL====================================
exports.deleteField = async (req, res) => {
  const { deleteField } = req.body;
 

  //This code will not allow to delete email and password.
  for (let i = 0; i < deleteField.length; i++) {
    let breaks;

    if (deleteField[i] === "email" || deleteField[i] === "password") {
      res.status(400).json({
        status: "fail",
        message: "You cannot delete email and password",
      });
      breaks = true;
      return;
    }
    if (breaks) break;
  }

  try {
    const user = await User.findById(req.user._id).select("-email");
    deleteField.map((field) => {
      user[field] = null;
    });
    user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      message: "Deleted field successfully.",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

/*
====================THIS IS THE MIDDLEWARE FUNCTION TO VALIDATE THE TOKEN========================
*/
exports.protect = async (req, res, next) => {
  //1)Getting token and checking if its there.
  let token;
  if (req.headers.token) {
    token = req.headers.token;
  }

  if (!token) {
    res.status(401).json({
      status: "fail",
      message: "You are not logged in! Please log in to get access",
    });
    return;
  }
  //2)Verification token
  try {
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

    //3)Check if user still exist
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      res.status(401).json({
        status: "fail",
        message: "The user belonging to this token does not exist",
      });
      return;
    }
    /*
    HERE TOKEN HAS PASSES ALL THE VALIDATION AND IN NEXT LINE WE PUT
    THE USER ON REQUEST OBJECT SO THAT IT CAN AVAILABLE FOR NEXT FUNCTION.
    */
    req.user = freshUser;
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
    return;
  }
  next();
};
