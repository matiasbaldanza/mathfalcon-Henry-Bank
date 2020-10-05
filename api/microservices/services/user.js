const express = require("express");
const { User, Account, Transaction } = require("../db.js");
const server = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

///////////////
// MIDDLEWARES
///////////////
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev")); // Intializing console logger middleware for HTTP requests.

///////////////
// ROUTES
///////////////

// Route for getting all users
server.get("/users", (req, res, next) => {
  User.findAll()
    .then((users) => { res.status(200).send({ success: true, message: "users: ", users }) })
    .catch((err) => res.status(400).send({ success: false, message: "error: ", err }));
});
// Route for getting user income
server.get("/users/income/:id", (req, res, next) => {
  Account.findOne({ where: { userId: id } })
    .then((account) => {
      Transaction.findAll({ where: { receiver: account.id } })
        .then((transactions) => {
          for (let i = 0, sum = 0; i < transactions.length; i++)
            if (transactions[i].state === 'complete') sum += transactions[i].amount
          res.send({ success: true, message: "Your incomes are: ", sum })
        })
        .catch((err) => res.status(400).send({ success: false, message: "error: ", err }));
    })
    .catch((err) => res.status(400).send({ success: false, message: "error: ", err }));
});
// Route for getting user outcome
server.get("/users/outcome/:id", (req, res, next) => {
  Account.findOne({ where: { userId: id } })
    .then((account) => {
      Transaction.findAll({ where: { sender: account.id } })
        .then((transactions) => {
          for (let i = 0, sum = 0; i < transactions.length; i++)
            if (transactions[i].state === 'complete') sum += transactions[i].amount
          res.send({ success: true, message: "Your outcomes are: ", sum })
        })
        .catch((err) => res.status(400).send({ success: false, message: "error: ", err }));
    })
    .catch((err) => res.status(400).send({ success: false, message: "error: ", err }));
});
// Route for posting a new user 
server.post("/users/create", (req, res, next) => {
  const { email, password, passcode, docType, docNumber, name, surname, birth, phone, street, street_number, locality, state, country, role } = req.body;
  User.create({ email, password, passcode, docType, docNumber, name, surname, birth, phone, street, street_number, locality, state, country, role })
    .then(userCreated => { res.status(200).send(userCreated) })
    .catch((err) => res.status(400).send({ success: false, message: "error: ", err }));
});
// Route to update an user information
server.put("/users/update/:id", (req, res, next) => {
  const { email, password, passcode, docType, docNumber, name, surname, birth, phone, street, street_number, locality, state, country, role } = req.body;
  User.findByPk(req.params.id)
    .then(user => { user.update({ email, password, passcode, docType, docNumber, name, surname, birth, phone, street, street_number, locality, state, country, role }) })
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => res.status(400).send({ success: false, message: "error: ", err }));
});
// Route to promote the user role to admin 
server.patch("/users/promote/:id", (req, res, next) => {
  User.findByPk(req.params.id)
    .then(user => { user.update({ role: "admin" }) })
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => res.status(400).send({ success: false, message: "error: ", err }));
});
// Route to delete an user 
server.delete("/users/:id", (req, res) => {
  User.destroy({ where: { id: req.params.id } })
    .then((deletedRecord) => {
      if (deletedRecord === 1)
        res.status(200).json({ success: true, message: "User deleted" });
      else res.status(400).json({ success: false, message: "User not found" });
    })
    .catch((err) => res.status(400).send({ success: false, message: "error: ", err }));
});

server.listen(3000, () => {
  console.log("User service running on 3000");
});

module.exports = server;
