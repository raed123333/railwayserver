const express=require('express');
const{getNotificationById,getNotifications,createNotification,updateNotification,deleteNotification}=require('../controllers/NotificationController');
const router=express.Router();
router.get('/',getNotifications);
router.get('/:idnot',getNotificationById);
router.post('/',createNotification);
router.put('/:idnot',updateNotification);
router.delete('/:idnot',deleteNotification);
module.exports=router;