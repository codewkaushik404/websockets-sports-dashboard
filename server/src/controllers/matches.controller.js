import Matches from "../models/matchSchema.js";
import {createMatchValidation} from "../utils/matchValidation.js"
import zod from "zod";

export async function getMatches(req, res){
    try{
        let no_of_matches = Number(req.query.limit);
        if(isNaN(no_of_matches) || no_of_matches > 50) no_of_matches = 50;

        const matches = await Matches.find().limit(no_of_matches);
        if(matches){
            return res.json({message: "Matches successfully fetched", data: matches});
        }
        return res.status(404).json({message: "No matches found"});
    }catch(err){
        throw new Error(err);
    }
}

export async function createMatch(req, res){
    try{
        const validation = createMatchValidation.parse(req.body);
        await Matches.create(validation);
        return res.json({message: "New match created successfully"});

    }catch(err){
        if(err instanceof zod.ZodError){
    
            const error = err.issues.map(issue => ({
                message: issue.message,
                path: issue.path
                })
            )
            console.error(error);
            return res.status(400).json({message: "Invalid data", error });
        }
        throw new Error(err);
    }
}