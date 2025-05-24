const express = require("express");
const {
  createParent,
  updateParent,
  deleteParent,
  loginParent,
  getParentById,
  getEnfantApps,
  lockEnfantApps,
  linkEnfantToParent,
  getAllChildrenByParentId,
  getTimeManagment,
  updatePushToken,
  getPushTokenByParentId,
  getLocation
} = require("../controllers/ParentController");

const router = express.Router();

router.get("/:idp", getParentById);

router.post("/", createParent);

router.post("/login", loginParent);

router.put("/:idp", updateParent);

router.delete("/:idp", deleteParent);

router.get("/apps/get-apps/:idenf", getEnfantApps);

router.post("/apps/lock-apps/:idenf", lockEnfantApps);

router.post("/link/:idp/:idenf", linkEnfantToParent);

router.get("/childs/:idp", getAllChildrenByParentId);

router.get("/timemanagment/:idenf", getTimeManagment);
router.get("/get-location/:idenf", getLocation);

router.put("/pushToken/:idp", updatePushToken);
router.get("/pushToken/:idp", getPushTokenByParentId);

module.exports = router;
