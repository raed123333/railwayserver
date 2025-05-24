const Donnees =require("../models/Donnees");
exports.getDonnees=async(req , res)=>{
        try{
                const donnees=await Donnees.findAll();
                res.json(donnees);

        }catch(err){
                res.status(500).json({error: err.message});

        }
};
exports.getDonneeById=async(req , res)=>{
        try{
                const donnee=await Donnees.findByPk(req.params.iddon);
                if(!donnee) return res.status(404).json({error:"Donnée non trouvée"});
                res.json(donnee);
        }catch(err){
                console.error(err);
                res.status(500).json({message: err.message});
        }
};
exports.createDonnee=async(req , res)=>{
        try{
                const {cap,image,gestion,local,appblock,idenf}=req.body;
                const newDonnee=await Donnees.create({cap,image,gestion,local,appblock,idenf});
                res.status(201).json(newDonnee);

        }catch(err){
                console.error(err);
                res.status(500).json({message: err.message});
        }
};
exports.updateDonnee=async(req,res)=>{
        try{
                const donnee=await Donnees.findByPk(req.params.iddon);
                if(!donnee) return res.status(404).json({error:"Donnée non trouvée"});
                const {cap,image,gestion,local,appblock,idenf}=req.body;
                await donnee.update({cap,image,gestion,local,appblock,idenf});
                res.json(donnee);

        }catch(err){
                console.error(err);
                res.status(500).json({message: err.message});
        }
};

exports.deleteDonnee= async (req,res)=>{
        try{
                const donnee=await Donnees.findByPk(req.params.iddon);
                if(!donnee) return res.status(404).json({error:"Donnée non trouvée"});
                await donnee.destroy();
                res.json({message:"Donnée supprimée"});

        }catch(err){
                console.error(err);
                res.status(500).json({message: err.message});
        }
};