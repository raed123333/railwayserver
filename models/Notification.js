const {DataTypes}=require("sequelize");
const sequelize = require("../config/db");

const Notification=  sequelize.define("Notification",{
        idnot:{
                type:DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true
        },
        titre:{
                type:DataTypes.STRING,
                allowNull:false,
        },
        contenu:{
                type:DataTypes.STRING,
                allowNull:false,
        },
              

},
{
        timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = Notification;