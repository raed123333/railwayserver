const Notification =require("../models/Notification");

exports.getNotifications = async (req,res )=>{
        try{
                const notifications = await Notification.findAll();
                res.json(notifications);        

        }catch(err){
                console.error(err);
                res.status(500).json({message: err.message});
        }
};

exports.getNotificationById = async (req,res )=>{
        try{
                const notifications=await Notification.findByPk(req.params.idnot)
                if(!notifications) return res.status(404).json({message:"notifications non trouvées"});
                res.json(notifications);

        }catch(err){
                console.error(err);
                res.status(500).json({message: err.message});
        }

};

exports.createNotification = async (req,res )=>{
        try{
                const {titre,contenu}=req.body;
                const newNotification=await Notification.create({titre,contenu});
                res.status(200).json( newNotification);

        }catch(err){
                console.log(err);
                console.error(err);
                res.status(500).json({message: err.message});
        }
};
exports.updateNotification=async (req,res)=>{
        try{
                const notification=await Notification.findByPk(req.params.idnot);
                if(!notification) return res.status(404).json({error:'aucun notification'});
                const {titre,contenu}=req.body;
                await notification.update({titre,contenu});
                res.json(notification);

        }catch(err){
                console.error(err);
                res.status(500).json({message: err.message});
        }
}

exports.deleteNotification=async(req,res)=>{
        try{
                const notification=await Notification.findByPk(req.params.idnot);
                if(!notification) return res.status(404).json({error:'aucun notification'});
                await notification.destroy();
                res.json({message:"notificatino supprimé"});

        }catch(err){
                console.error(err);
                res.status(500).json({message: err.message});
        }
}