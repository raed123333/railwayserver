const Exercice=require("../models/Exercice");

//get all exercice
exports.getExercice=async(req,res)=>{
        try{
                const exercice=await Exercice.findAll();
                res.json(exercice);

        }catch(err){
                res.status(500).json({error:err.message});
        }
}

//get exercice by id
exports.getExerciceById=async(req,res)=>{
        try{
                const exercice=await Exercice.findByPk(req.parmas.idEx);
                if(!exercice) return res.status(404).json({error:"Exercice non trouve"});
                res.json(exercice);

        }catch(err){
                res.status(500).json({error:err.message});
        }
};

//create a new exercice
exports.createExercice=async (req,res)=>{
        try{
                const{idEx,statutEx,scoreEx,DescriptionEx,idPrix}=req.body;
                const newEexercice=await Exercice.create({idEx,statutEx,scoreEx,DescriptionEx,idPrix});
                res.status(201).json(newEexercice);
        }catch(err){
                res.status(500).json({error:err.message});
        }
};
//////update exercice
exports.updateExercice= async(req,res)=>{
        try{
                const exercice=await Exercice.findByPk(req.parmas.idEx);
                if(!exercice) return res.status(404).json({error:"aucun exercice"});
                const {statutEx,scoreEx,DescriptionEx}=req.body;
                await Exercice.update(
                        {statutEx,scoreEx,DescriptionEx},
                        {where:{idEx:req.params.idPrix}}
                );
                const updateExercice=await Exercice.findByPk(req.params.idEx);
                res.json(updateExercice);
        }catch(err){
                res.status(400).json({error:err.message});
        }

};

////delete exercice
exports.deleteExercice=async(req,res)=>{
        try{
                const exercice=await Exercice.findByPk(req.params.idEx);
                if(exercice) return res.status(404).json({error:"aucun exercice"});
                await exercice.destroy();
                res.json({message:"exercice supprime "});
        }catch(err){
                res.status(500).json({error:err.message});
        }
}