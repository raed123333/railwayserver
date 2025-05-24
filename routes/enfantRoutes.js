const express = require('express');
const {getEnfants,getEnfantById,createEnfant,updateEnfant,deleteEnfant,loginEnfant, getParentIdByEnfantId} = require("../controllers/EnfantController");

const router = express.Router();

router.get('/', getEnfants);
router.get('/:idenf', getEnfantById);
router.post('/', createEnfant);
router.put('/:idenf', updateEnfant);
router.delete('/:idenf', deleteEnfant);
router.post('/loginEnfant', loginEnfant);
router.get('/getParentIdByEnfantId/:idenf', getParentIdByEnfantId);

module.exports = router;