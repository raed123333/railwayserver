const express =require('express');
const {getDonneeById,getDonnees,updateDonnee,deleteDonnee,createDonnee}=require("../controllers/DonneeController")
const router = express.Router();
router.get('/',getDonnees);
router.get('/:iddon',getDonneeById);
router.post('/',createDonnee);
router.put('/:iddon',updateDonnee);
router.delete('/:iddon',deleteDonnee);
module.exports = router;