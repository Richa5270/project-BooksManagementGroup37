const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, 
      trim: true,
      enum:["Mr", "Mrs", "Miss"],
    },
    name:{
      type:String,
      trim:true,
      required:true, 
    },
    phone: {
      type: Number,
      trim: true,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true, 
    },
    password:{
      type:String,
      trim:true,
      minlength:8,
      maxlength:15,
    },
    address: {
        street: { type: String },
        city: { type: String },
        pincode: { type: String }
    },
  },{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);