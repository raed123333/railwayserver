const express = require("express");
const router = express.Router();
const messengerController = require("../controllers/MessengerController");

router.post("/send", messengerController.sendMessage);
router.get("/parentmessage/:idp/:idenf", messengerController.parentGetMessages);
router.get("/messages/:id", messengerController.getMessages);
router.delete("/delete/:idmess", messengerController.deleteMessage);

module.exports = router;
