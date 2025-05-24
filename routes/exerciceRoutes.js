const express=require('express');
const{deleteExercice,updateExercice,createExercice,getExerciceById,getExercice}=require("../controllers/ExerciceController");
const router = express.Router();


router.get('/',getExercice);
router.get('/:idEx',getExerciceById);
router.post('/',createExercice);
router.put('/:idEx',updateExercice);
router.delete('/:idEx',deleteExercice);

module.exports=router;