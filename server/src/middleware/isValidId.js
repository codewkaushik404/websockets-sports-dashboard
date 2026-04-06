import mongoose from "mongoose";

export default function isValidMongooseId(req, res, next){
    const matchId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(matchId)){
        return res.status(400).json({message: "Invalid Match ID"})
    }
    next();
}