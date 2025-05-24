const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Assurez-vous d'importer votre instance Sequelize
const Enfant = require("./Enfant"); // Importer le modèle Enfant

const Donnes =  sequelize.define("Donnes", {
    iddon: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cap: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gestion: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    local: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    appblock: {
        type: DataTypes.JSON, // Stocker un tableau sous forme de JSON
        allowNull: false,
    },
    idenf: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Enfant, // Référence au modèle Enfant
            key: "idenf"   // Assurez-vous que "idenf" est bien la clé primaire de Enfant
        }
    }
});

// Relation : Donnes appartient à un Enfant
Donnes.belongsTo(Enfant, { foreignKey: "idenf", onDelete: "CASCADE" });

// Exporter le modèle
module.exports = Donnes;
