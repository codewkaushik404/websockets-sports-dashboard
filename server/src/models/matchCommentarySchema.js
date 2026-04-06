import mongoose from "mongoose";

//event type -> goal, foul, wicket, substitution,etc..
//period -> 1st half, over_11, etc...
const matchCommentary = new mongoose.Schema({
    matchId: {type: mongoose.Schema.Types.ObjectId, ref: "Matches", required: true},
    eventType: {type: String, required: true},
    actor: {type: String, required: true},
    team: {type: String, required: true},
    message: {type: String, required: true},
    period: {type: String, required: true},
    tags: {
        type: [String],  
        required: true,
        validate: {
            validator: arr => arr.every(tag => tag && tag.trim().length > 0),
            message: "Tags must be non-empty"
        } 
    },
    metadata: {type: mongoose.Schema.Types.Mixed, default: {} }
    
}, {timestamps: true})

const Commentary = mongoose.model("Commentary", matchCommentary);
export default Commentary;