import Matches from "../models/matchSchema.js";
import {createMatchValidation} from "../utils/matchValidation.js"
import zod from "zod";

export async function getMatches(req, res){
    let no_of_matches = Number(req.query.limit);
    if(isNaN(no_of_matches) || no_of_matches <= 0 || no_of_matches > 50) no_of_matches = 50;

    const matches = await Matches.find().limit(no_of_matches);
    if(matches.length > 0){
        return res.json({message: "Matches successfully fetched", data: matches});
    }
    return res.status(404).json({message: "No matches found"});
}

export async function createMatch(req, res){

    const validation = createMatchValidation.parse(req.body);
    const match = await Matches.create(validation);
    const {_id, createdAt, updatedAt, __v, ...data} = match.toJSON();

    if(app.locals.broadcastMatchCreated){
        broadcastMatchCreated(data);
    }
    return res.json({message: "New match created successfully"});

}