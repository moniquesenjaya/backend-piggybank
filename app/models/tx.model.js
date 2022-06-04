const mongoose = require("mongoose")
const getTx = () => {
  const Tx = mongoose.model(
    "tx",
    mongoose.Schema(
      {
        email: String,
        details: String,
        category: String,
        amount: Number,
        type: String
      },
      { timestamps: true }
    )
  );
  return Tx;
};

exports.getTx = getTx