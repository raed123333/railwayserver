const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db");
const Parent = require("./Parent");
const Enfant = require("./Enfant");

const Messenger = sequelize.define("Messenger", {
    idmess: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
 
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message_time: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    }
}, {
    tableName: "messenger",
    timestamps: false
});

// Define relationships (optional, for easier querying)
Parent.hasMany(Messenger, { foreignKey: "sender_id", as: "sentMessages", constraints: false });
Enfant.hasMany(Messenger, { foreignKey: "sender_id", as: "sentMessages", constraints: false });

module.exports = Messenger;
