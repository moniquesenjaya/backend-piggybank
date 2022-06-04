const user = require("./app/controllers/piggybanc.controller");
const tx = require("./app/controllers/piggybanc.controller");
const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");
const app = express()
const jwt = require('jsonwebtoken');
const db = require("./app/models");
var corsOptions = {
  origin: "http://localhost:8081"
};


// Custom Middleware
const validateToken = (req,res,next) => {
  const headers = req.headers.authorization
  console.log(req.headers)
  console.log(headers)
  const token = headers && headers.split('.')[1]
  console.log(token)
  if (headers === null) return res.sendStatus(401)

  jwt.verify(headers, process.env.TOKEN, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user
    next()
  } )
}


app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to piggybanc application." });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.post("/user", user.create)
app.put("/user/update", validateToken, user.setProfile)
app.get("/user/:email", user.getProfile)
app.post("/user/:id", user.login)
app.get("/tx", validateToken, tx.getTx)
app.post("/tx", tx.addTx)

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

