const user = require("./app/controllers/piggybanc.controller");
const tx = require("./app/controllers/piggybanc.controller");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const server = require("./app/routes/piggybanc.routes")
const app = express()
require("./app/routes/piggybanc.routes")(app);
const db = require("./app/models");
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to piggybanc application." });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.post("/user", user.create)
app.put("/user/:id", user.setProfile)
app.get("/user/:id", user.getProfile)
app.post("/user/:id", user.login)
app.get("/tx", tx.getTx)
app.post("/tx", tx.addTx)
app.get("/bal", tx.getBalance)

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
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

