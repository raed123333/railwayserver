const Messenger = require("../models/Messenger");
const Parent = require("../models/Parent");
const Enfant = require("../models/Enfant");
const { Op } = require("sequelize");

// Send Message (Parent to Enfant or Enfant to Parent)
exports.sendMessage = async (req, res) => {
    try {
      const { sender_id, receiver_id, message } = req.body;
  
      const newMessage = await Messenger.create({
        sender_id,
        receiver_id,
        message
      });
  
      // Get io from request (we'll pass it from middleware)
      const io = req.app.get("io");
  
      // Emit to both sender and receiver
      io.to(receiver_id.toString()).emit("receiveMessage", newMessage);
      io.to(sender_id.toString()).emit("receiveMessage", newMessage);
  
      res.status(201).json(newMessage);
    } catch (err) {
      console.log(err, "err from send message");
      res.status(500).json({ error: err.message });
    }
  };
  
exports.getMessages = async (req, res) => {
    try {
        const { id } = req.params;

        const messages = await Messenger.findAll({
            where: {
                [Op.or]: [
                    { sender_id: id },
                    { receiver_id: id }
                ]
            },
            order: [['message_time', 'ASC']]
        });

        res.status(200).json(messages);
    } catch (err) {
        console.log(err, "err from getMessages");
        res.status(500).json({ error: err.message });
    }
};


// Get all messages between a specific parent and kid
exports.parentGetMessages = async (req, res) => {
    try {
        const { idp, idenf } = req.params;

        const messages = await Messenger.findAll({
            where: {
                [Op.or]: [
                    { sender_id: idp, receiver_id: idenf },
                    { sender_id: idenf, receiver_id: idp }
                ]
            },
            order: [['message_time', 'ASC']]
        });

        res.status(200).json(messages);
    } catch (err) {
        console.log(err, "err from parentGetMessages");
        res.status(500).json({ error: err.message });
    }
};




// Delete a Message
exports.deleteMessage = async (req, res) => {
    try {
        const { idmess } = req.params;
        const message = await Messenger.findByPk(idmess);
        if (!message) {
            return res.status(404).json({ error: "Message non trouvé" });
        }
        await message.destroy();
        res.json({ message: "Message supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
