const {DataTypes}=require("sequelize");
const sequelize=require("../config/db");
const Prix = sequelize.define("Prix", {
        idPrix: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nomPrix: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        scorePrix: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        statut: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        idp: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Parents',
            key: 'idp',
          },
          onDelete: "CASCADE",
        }
      }, {
        freezeTableName: true
      });
      
module.exports=Prix;