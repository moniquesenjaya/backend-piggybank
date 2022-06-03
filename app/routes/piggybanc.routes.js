const express = require("express");

module.exports = app => {
    const user = require("../controllers/piggybanc.controller");
    const tx = require("../controllers/piggybanc.controller");
    var router = require("express").Router();
    router.post("/user", user.create)
    router.put("/user/:id", user.setProfile)
    router.get("/user/:id", user.getProfile)
    router.post("/user/:id", user.login)
    router.get("/tx", tx.getTx)
    router.post("/tx", tx.addTx)
    router.get("/bal", tx.getBalance)
    return router;
  };