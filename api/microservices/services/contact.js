const express = require("express");
const { User, Contact, Account } = require("../db.js");
const server = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const whatsapp = require('../whatsapp');

////////////////
// MIDDLEWARES /
////////////////

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev")); // Intializing console logger middleware for HTTP requests.

///////////////
// ROUTES /GET/
///////////////

// Route for getting all contacts
server.get("/contacts", (req, res, next) => {
  Contact.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["email", "id"],
        include: Account,
      },
    ]
  })
    .then((contacts) => {
      res.send({ success: true, message: "Contacts list: ", contacts });
    })
    .catch((err) =>
      res
        .status(400)
        .send({ success: false, message: "Something went wrong: ", err })
    );
});

// Route for getting the contacts of a specific user
server.get("/contacts/:userId", (req, res, next) => {
  const { userId } = req.params;
  Contact.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["email", "id", 'documentPhoto'],
        include: Account,
      },
    ],
  })
    .then((contacts) => {
      contacts
        ? res.send({ success: true, message: `Contacts of userID ${userId} `, contacts })
        : res.send({ success: false, message: "Contact not found" });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .send({ success: false, message: "Something went wrong: ", err });
    });
});

////////////////
// ROUTES /POST/
////////////////

// Route to connect whatsapp to the server
server.post("/contacts/whatsapp/connect", whatsapp.connectApi);
// Route to send whatsapp notifications
server.post("/contacts/whatsapp/sendmessage", whatsapp.sendMessage);
// Route to send Whatsapp invitations
server.post("/contacts/whatsapp/invitation", whatsapp.sendInvitation);

// Route for assigning a new contact
server.post("/contacts/create", async (req, res, next) => {
  const { userId, alias, emailOfContact } = req.body;

  const is_contact_of = await User.findOne({
    where: { email: emailOfContact },
  });
  if(is_contact_of === null) return res.send({ success: false, message: "The provided email is not a Henry Bank client, do you want to send him and invitation?", code: 'not_client'})
  if(emailOfContact === 'bankhenry@recharges.com') return res.send({ success: false, message: "You can't add this adress to your contact list." })
  // if(!is_contact_of) return whatsapp.sendInvitation(req, res, phoneNumber, userName);
  Contact.create({ userId, alias, is_contact_of: is_contact_of.id })
    .then((contactCreated) => {
      res.send({ success: true, message: "Contact created: ", contactCreated });
    })
    .catch((err) =>
      res
        .status(400)
        .send({ success: false, message: "Something went wrong: ", err })
    );
});


///////////////
// ROUTES /PUT/
///////////////

// Route for updating a contact information
server.put("/contacts/update/:id", (req, res, next) => {
  const {alias} = req.body  
  Contact.findByPk(req.params.id)
    .then((contact) => {
      contact.update({alias});
    })
    .then((updatedContact) =>
      res.send({ success: true, message: "Updated contact: ", updatedContact })
    )
    .catch((err) =>
      res
        .status(400)
        .send({ success: false, message: "Something went wrong: ", err })
    );
});

//////////////////
// ROUTES /DELETE/
//////////////////

// Route to delete a contact
server.delete("/contacts/delete/:contactId", (req, res) => {
  const {contactId} = req.params  
  Contact.destroy({where: {id: contactId}})
    .then((deletedRecord) => {
      if (deletedRecord === 1)
        res.send({ success: true, message: "Contact deleted" });
      else
        res.status(400).send({ success: false, message: "Contact not found" });
    })
    .catch((err) =>
      res
        .status(400)
        .send({ success: false, message: "Something went wrong: ", err })
    );
});

server.listen(3004, () => {
  console.log("Contact service running on 3004");
});

module.exports = server;
