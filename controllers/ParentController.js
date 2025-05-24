const fs = require("fs");
const path = require("path");
const Parent = require("../models/Parent");
const Enfant = require("../models/Enfant");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const saveBase64Image = (base64String, folder = "uploads") => {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches) return null;
  const ext = matches[1].split("/")[1];
  const base64Data = matches[2];
  const fileName = `${Date.now()}.${ext}`;

  const uploadDir = path.join(__dirname, "..", folder);
  const filePath = path.join(uploadDir, fileName);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  fs.writeFileSync(filePath, base64Data, "base64");
  return fileName;
};

exports.createParent = async (req, res) => {
  try {
    const { nom, prenom, email, motpasse, image } = req.body;

    let imageName = null;
    if (image) {
      imageName = saveBase64Image(image);

      // Save Base64 and get filename
    }

    const newParent = await Parent.create({
      nom,
      prenom,
      email,
      motpasse,
      image: imageName,
    });
    res.status(201).json(newParent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a Parent (with optional new image)
exports.updateParent = async (req, res) => {
  try {
    const parent = await Parent.findByPk(req.params.idp);
    if (!parent) return res.status(404).json({ error: "Parent non trouvé" });

    const { nom, prenom, motpasse, image } = req.body;

    let imageName = parent.image;
    if (image) {
      imageName = saveBase64Image(image);
    }

    await parent.update({ nom, prenom, motpasse, image: imageName });

    res.json({ message: "Parent mis à jour", parent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.loginParent = async (req, res) => {
  try {
    const { email, motpasse } = req.body;

    const parent = await Parent.findOne({ where: { email } });

    if (!parent) {
      return res.status(404).json({ error: "Parent non trouvé" });
    }

    const isPasswordValid = motpasse == parent.motpasse;

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Générer le token
    const token = jwt.sign(
      { id: parent.idp, email: parent.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const enfants = await Enfant.findAll({ where: { idp: parent.idp } });

    res.status(200).json({
      message: "Connexion réussie",
      parent,
      enfants,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.linkEnfantToParent = async (req, res) => {
  try {
    const { idp, idenf } = req.params;

    // Vérifier si le parent existe
    const parent = await Parent.findByPk(idp);
    if (!parent) {
      return res.status(404).json({ error: "Parent non trouvé" });
    }

    // Vérifier si l'enfant existe
    const enfant = await Enfant.findByPk(idenf);
    if (!enfant) {
      return res.status(404).json({ error: "Enfant non trouvé" });
    }

    // Mettre à jour l'enfant avec l'ID du parent
    await enfant.update({ idp });

    res.status(200).json({ message: "Enfant lié au parent avec succès", enfant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//delete a Parent
exports.deleteParent = async (req, res) => {
  try {
    const parent = await Parent.findByPk(req.params.idp);
    if (!parent) return res.status(404).json({ error: "Parent non trouvé" });
    await parent.destroy();
    res.json({ message: "Parent supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all Parents
exports.getAllParents = async (req, res) => {
  try {
    const parents = await Parent.findAll();
    res.status(200).json(parents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a Parent by ID
exports.getParentById = async (req, res) => {
  try {
    const parent = await Parent.findByPk(req.params.idp);
    if (!parent) return res.status(404).json({ error: "Parent non trouvé" });

    res.status(200).json(parent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Get all children by parent ID
exports.getAllChildrenByParentId = async (req, res) => {
  try {
    const parentId = req.params.idp; // Get the parent's ID from the request parameters

    // Find all children associated with the given parent ID
    const enfants = await Enfant.findAll({ where: { idp: parentId } });

    if (enfants.length === 0) {
      return res.status(404).json({ error: "Aucun enfant trouvé pour ce parent" });
    }

    // Return the list of children
    res.status(200).json(enfants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getEnfantApps = async (req, res) => {
  try {
    const { idenf } = req.params; // Récupérer l'ID de l'enfant depuis les paramètres de la requête

    // Récupérer l'enfant depuis la base de données
    const enfant = await Enfant.findByPk(idenf);

    if (!enfant) {
      return res.status(404).json({ error: "Enfant non trouvé" });
    }

    const Ip = enfant.ip;

    const response = await axios.get(`http://${Ip}:5555/get-apps`);

    res.json(response.data);
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des applications:", error);
    res.status(500).send("Erreur lors de la récupération de la liste des applications");
  }
};


exports.lockEnfantApps = async (req, res) => {
  console.log("Received body:", req.body); // Log to see what is received
  const { packageName, password } = req.body;

  // Check if packageName and password are provided
  if (!packageName || !password) {
    return res.status(400).send("Package name and password are required");
  }

  console.log("Package Name:", packageName);
  console.log("Password:", password);

  try {
    const { idenf } = req.params; // Récupérer l'ID de l'enfant depuis les paramètres de la requête

    // Récupérer l'enfant depuis la base de données
    const enfant = await Enfant.findByPk(idenf);

    if (!enfant) {
      return res.status(404).json({ error: "Enfant non trouvé" });
    }

    const Ip = enfant.ip; // Récupérer l'adresse IP stockée
    // Log the data being sent to the Android server
    console.log("Sending to Android server:", {
      packageName,
      password,
    });

    // Send the data as JSON
    const response = await axios.post(
      `http://${Ip}:5555/lock-app`,
      {
        packageName,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json", // Ensure the request is sent as JSON
        },
      }
    );

    console.log("Response from Android:", response.data); // Log Android response for debugging
    res.json({ message: "App locked successfully", status: response.status });
  } catch (error) {
    console.error("Error locking app:", error);
    res.status(500).send("Error locking app");
  }
};



exports.getTimeManagment = async (req, res) => {
  try {
    const { idenf } = req.params;

    const enfant = await Enfant.findByPk(idenf);

    if (!enfant) {
      return res.status(404).json({ error: "Enfant non trouvé" });
    }

    const Ip = enfant.ip;
    const response = await axios.get(
      `http://${Ip}:8080/usage`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response from Android:", response);
    res.json({ status: response.data });
  } catch (error) {
    console.error("Error locking app:", error);
    res.status(500).send("Error getting data app");
  }
};





exports.getLocation = async (req, res) => {
  try {
    const { idenf } = req.params;

    const enfant = await Enfant.findByPk(idenf);

    if (!enfant) {
      return res.status(404).json({ error: "Enfant non trouvé" });
    }

    const Ip = enfant.ip;
    const response = await axios.get(
      `http://${Ip}:6666/get-location`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response from Android:", response);
    res.json({ status: response.data });
  } catch (error) {
    console.error("Error getting location:", error);
    res.status(500).send("Error getting data app");
  }
};



// Update Push Token of a Parent
exports.updatePushToken = async (req, res) => {
  try {
    const { idp } = req.params;
    const { pushToken } = req.body;

    const parent = await Parent.findByPk(idp);
    if (!parent) {
      return res.status(404).json({ error: "Parent non trouvé" });
    }

    await parent.update({ pushToken });

    res.status(200).json({ message: "Push token mis à jour", pushToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Get Push Token of a Parent
exports.getPushTokenByParentId = async (req, res) => {
  try {
    const { idp } = req.params;

    const parent = await Parent.findByPk(idp);
    if (!parent) {
      return res.status(404).json({ error: "Parent non trouvé" });
    }

    res.status(200).json({ pushToken: parent.pushToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

