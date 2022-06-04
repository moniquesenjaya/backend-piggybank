const express = require("express");

module.exports = app => {
    const user = require("../controllers/piggybanc.controller");
    const tx = require("../controllers/piggybanc.controller");
    var router = require("express").Router();
    router.post("/user", user.create)
    router.put("/user/update", user.setProfile)
    router.get("/user/:email", user.getProfile)
    router.post("/user/login", user.login)
    router.get("/tx", tx.getTx)
    router.post("/tx", tx.addTx)
    return router;
  };