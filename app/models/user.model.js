const mongoose = require("mongoose")
const getUser = () => {
  const User = mongoose.model(
    "user",
    mongoose.Schema(
      {
        email: String,
        password: {type: String, required: true, maxLength: 255},
        name: String,
        dob: Date,
        balance: Number,
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