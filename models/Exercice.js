const {DataTypes}= require("sequelize");
const sequelize=require("../config/db");
const Exercice = sequelize.define("Exercice", {
        idEx: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        DescriptionEx: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        scoreEx: {
          type: DataTypes.INTEGER,
          allowNull: false, 
        },
        statutEx: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        idPrix: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Prix',
            key: 'idPrix',
          },
          onDelete: "CASCADE",
        },
      }, {
        freezeTableName: true
      });
      module.exports=Exercice;   