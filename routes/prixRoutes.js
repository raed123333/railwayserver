const express =require ('express');
const{deletePrix,updatePrix,createPrix,getPrixById,getPrix}=require("../controllers/PrixController");

const router= express.Router();

router.get('/',getPrix);
router.get('/:idPrix',getPrixById);
router.post('/',createPrix);
router.put('/:idPrix',updatePrix);
router.delete('/:idPrix',deletePrix);

module.exports =router;