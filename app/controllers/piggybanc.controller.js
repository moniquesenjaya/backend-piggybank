const transactions = require("../models/tx.model");
const user = require("../models/user.model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Users = user.getUser();
const Tx = transactions.getTx();

const passwordValidator = async (db, hash) => {
  return validate = await bcrypt.compare(password, dbPassword);
}

const generateToken = (email) => {
  return jwt.sign(email, process.env.TOKEN, { expiresIn: '9000s' })
}

exports.create = async (req, res) => {
  console.log("create sign up")
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Check if the email is already used
  const existingUser = Users.findOne({ email: req.body.email }, (error, document) => {
    if (document) {
      return res.status(409).send("User Already Exist. Please Login");
    }
  })

  // Hash the password
  const hash = await bcrypt.hash(req.body.password, 10);

  // Create JWT Token
  const token = generateToken({ email: req.body.email })

  // Fill Schema and Save in DB
  const user = Users({
    email: req.body.email,
    balance: 0,
    password: hash
  });

  user.save(user)
    .then(data => {
      res.send(token);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

exports.setProfile = async (req, res) => {
  console.log("set profile")
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const email = { email: req.body.email };
  const update = {
    name: req.body.name,
    address: req.body.address,
    dob: req.body.dob,
    occupation: req.body.occupation,
    gender: req.body.gender
  };

  try {
    const success = await Users.findOneAndUpdate(email, update)
    console.log("Successfully Updated" + success);
    res.status(200).send({
      message: "Successfully Updated" + success
    })
  }
  catch (err) {
    return res.status(400).send({
      message: "Email not found"
    })
  }
};

exports.getProfile = (req, res) => {
  console.log("get profile\n\n")

  const response = {
    profile: Users.findOne({ email: req.params.email }, (err, profile) => {
      if (err) res.status(400).send({ message: "Error Finding User" })
      res.status(200).send(profile)

    })
  }
  const test = response.profile
  // res.status(200).send(response.profile)
};

exports.login = async (req, res) => {
  // Error Handle the Request
  if (!req.body) {
    return res.status(400).send({
      message: "Data to login can not be empty!"
    });
  }


  try {
    // Destructure the email and password
    const { email, password } = req.body;
    const dbPassword= await Users.findOne({ email: email }, (err, user) => {
      return user.password;
    }).clone().exec();
    
    const validate = await bcrypt.compare(password, dbPassword.password);
    if (validate) {
      const token = generateToken({ email })
      user.token = token;
      user.email = email;
      res.send(user);
    }
  }
  catch (error) {
    console.log(error)
  }
  res.send("failed")
};

exports.getTx = (req, res) => {
  const email = req.query.email
  const type = req.query.type
  const category = req.query.category
  const date = req.query.date
  console.log(email, type, category, date)
  var query = {}
  if (type == null && category == null && date == null) {
    query = { email: email };
  }
  else if (category == null && date == null) {
    query = { email: email, type: type };
  }
  else if (category == null) {
    query = { email: email, type: type, createdAt: { $gte: date } };
  }
  else if (date == null) {
    query = { email: email, type: type, category: category };
  }
  else {
    query = { email: email, type: type, category: category, createdAt: { $gte: date } };
  }
  console.log(query)
  Tx.find(query)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tx."
      });
    });
};


exports.addTx = async (req, res) => {
  console.log("add tx")
  // Validate request
  if (!req.body.email) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Create a tx
  const tx = Tx({
    email: req.body.email,
    details: req.body.details,
    category: req.body.category,
    amount: req.body.amount,
    type: req.body.type
  });

  //add or substract bal from user 
  if (tx.type == "Income"){
    let balance = 0
    try{
      balance = await Users.findOne({email : req.body.email} , (err, user) => {
        return user.balance
      }).clone().exec()
      // console.log(balance.balance + "\n\n" + req.body.amount)
      const updated = await Users.findOneAndUpdate({email: req.body.email}, {balance:balance.balance+req.body.amount})
      console.log(updated)
    }
    catch(err){
      console.log(err)
    }
  }
  else if(tx.type =="Expense"){
    let balance = 0
    try{
      balance = await Users.findOne({email : req.body.email} , (err, user) => {
        return user.balance
      }).clone().exec()
      // console.log(balance.balance + "\n\n" + req.body.amount)
      const updated = await Users.findOneAndUpdate({email: req.body.email}, {balance:balance.balance-req.body.amount})
      console.log(updated)
    }
    catch(err){
      console.log(err)
    }
  }
  
  // Save tx in the database
  Tx
    .save(tx)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tx."
      });
    });
};


