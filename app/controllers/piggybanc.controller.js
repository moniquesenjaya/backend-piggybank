const db = require("../models/user.model");
const db2 = require("../models/tx.model");
const user = require("../models/user.model");
const { query } = require("express");
const Users = user.getUser();
const Tx = db2.getTx();

exports.create = (req, res) => {
    console.log("create sign up")
  if (!req.body.email) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const user = Users({
    email: req.body.email,
    password: req.body.password
  });
  user
    .save(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

exports.setProfile = (req, res) => {
    console.log("set profile")
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
      const id = req.params.id;
      console.log(id)
      console.log(id)
      Users.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update User with id=${id}. Maybe User was not found!`
            });
          } else res.send({ message: "User was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating User with id=" + id
          });
        });
};

exports.getProfile = (req, res) => {
  console.log("get profile")
  const id = req.params.id;
  Users.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found user with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving user with id=" + id });
    });
};

exports.login = (req, res) => {
  
};

exports.getTx = (req, res) => {
    const id = req.query.userid
    const type = req.query.type
    const category = req.query.category
    const date = req.query.date
    console.log(id, type, category, date)
    var query = {}
    if (type==null && category==null && date==null){
        query = {userid: id};
    }
    else if (category==null && date==null){
        query = {userid: id, type: type};
    }
    else if (category==null){
        query = {userid: id, type: type, createdAt: {$gte:date}};
    }
    else if (date==null){
        query = {userid: id, type: type, category: category};
    }
    else{
        query = {userid: id, type: type, category: category, createdAt: {$gte:date}};
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


exports.addTx = (req, res) => {
    console.log("add tx")
    // Validate request
    if (!req.body.userid) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    // Create a Tutorial
    const tx = Tx({
        userid: req.body.userid,
        details: req.body.details,
        category: req.body.category,
        amount: req.body.amount,
        type: req.body.type
    });
    // Save Tutorial in the database
    tx
      .save(user)
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

// get balaance still error idk how to fetch all expense and income from one id and substract it to get the balance
exports.getBalance = (req, res) => {
    const id = req.query.userid
    var exp = 0
    var income = 0
    var amt = 0
    Tx.find({userid: id})
      .then(data => {
        {data.map(d => (
            amt = d.amount
          ))}
        exp = exp + amt;
        console.log(exp)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tx."
        });
      });
};

