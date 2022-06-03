const mongoose = require("mongoose")
const getUser = ()=>{
  const User = mongoose.model(
    "user",
    mongoose.Schema(
      {
        email: String,
        password: String,
        name: String,
        dob: Date,
        address: String,
        gender: String,
        occupation: String
      },
      { timestamps: true }
    )
  );
    return User;
};

exports.getUser = getUser