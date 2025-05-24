
const Enfant = require("../models/Enfant");
const jwt = require("jsonwebtoken");

exports.getEnfants = async (req, res) => {
        try {
                const enfants = await Enfant.findAll();
                res.json(enfants);
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
};
// Get Enfant by idenf

exports.getEnfantById = async (req, res) => {
        try {
                const enfant = await Enfant.findByPk(req.params.idenf);
                if (!enfant) return res.status(404).json({ error: "Enfant non trouvé" });
                res.json(enfant);
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
};

//create a new Enfant
exports.createEnfant = async (req, res) => {
        try {
                const { nom, prenom, motpasse, idp, ip } = req.body;
                const newEnfant = await Enfant.create({ nom, prenom, motpasse, idp, ip });
                res.status(201).json(newEnfant);
        } catch (err) {
                res.status(400).json({ error: err.message });

        }
}

//update an Enfant
exports.updateEnfant = async (req, res) => {
        try {

                const enfant = await Enfant.findByPk(req.params.idenf);
                if (!enfant) return res.status(404).json({ error: "Aucun enfant" });

                const { nom, prenom, motpasse } = req.body;

                await Enfant.update(
                        { nom, prenom, motpasse },
                        { where: { idenf: req.params.idenf } } 
                );

                const updatedEnfant = await Enfant.findByPk(req.params.idenf);
                res.json(updatedEnfant);
        } catch (err) {
                res.status(400).json({ error: err.message });
        }
};

//delete enfant
exports.deleteEnfant = async (req, res) => {
        try {
                const enfant = await Enfant.findByPk(req.params.idenf);

                if (!enfant) return res.status(404).json({ error: "Aucun enfant " });

                await enfant.destroy();
                res.json({ message: "Enfant supprimé" });

        } catch (err) {
                res.status(500).json({ error: err.message });
        }
}


//login enfant 

exports.loginEnfant = async (req, res) => {
        try {
                const { nom, motpasse, ip } = req.body;

                const enfant = await Enfant.findOne({ where: { nom, motpasse } });

                if (!enfant) {
                        return res.status(404).json({ error: "Enfant non trouvé" });
                }

                // Update the enfant's IP address
                await enfant.update({ ip });

                // Generate JWT token
                const token = jwt.sign(
                        { id: enfant.ide, nom: enfant.nom },
                        process.env.JWT_SECRET,
                        { expiresIn: "7d" }
                );

                res.status(200).json({
                        message: "Connexion réussie",
                        enfant,
                        token,
                });
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
};


// Get Parent ID by Enfant ID
exports.getParentIdByEnfantId = async (req, res) => {
        try {
                const enfant = await Enfant.findByPk(req.params.idenf);

                if (!enfant) {
                        return res.status(404).json({ error: "Enfant non trouvé" });
                }

                res.status(200).json({ parentId: enfant.idp });
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
};
