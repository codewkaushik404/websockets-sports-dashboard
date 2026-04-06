import Commentary from "../models/matchCommentarySchema.js";
import { commentaryValidation } from "../utils/commentaryValidation.js";

export async function getCommentary(req, res) {

    const matchId = req.params.id;
    let noOfCommentaries = parseInt(req.query.limit, 10);
    if(isNaN(noOfCommentaries) || noOfCommentaries <= 0 || noOfCommentaries > 50){
        noOfCommentaries = 25;
    }    

    const commentaries = await Commentary.find({matchId}).select("-_id -createdAt -updatedAt -__v").limit(noOfCommentaries);
    if(commentaries.length === 0){
        return res.status(404).json({message: "No commentaries for the match found"});
    }
    return res.json({message: "Commentaries for the match successfully fetched", data: commentaries});
}

export async function createCommentary(req, res) {
    const matchId = req.params.id;
    const validData = commentaryValidation.parse(req.body);

    const commentary = await Commentary.create({matchId, ...validData});
    const {_id, createdAt, updatedAt, __v, ...data } = commentary.toJSON();
    return res.json({ message: "New commentary added successfully", data });
}