const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Parent = sequelize.define("Parent", {
        idp: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
        },
        nom: {
                type: DataTypes.STRING,
                allowNull: false
        },
        prenom: {
                type: DataTypes.STRING,
                allowNull: false
        },
        pushToken: {
                type: DataTypes.STRING,
                allowNull: true
        },
        image: {
                type: DataTypes.STRING,
                allowNull: true,

        },
        email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                        isEmail: true,
                },
        },
        motpasse: {
                type: DataTypes.STRING,
                allowNull: false,

        },

}, {
        timestamps: true, // Adds createdAt and updatedAt fields
});
module.exports = Parent;