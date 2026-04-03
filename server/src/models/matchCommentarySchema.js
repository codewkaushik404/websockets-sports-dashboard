import mongoose from "mongoose";

const matchCommentary = new mongoose.Schema({
    matchId: {type: mongoose.Schema.Types.ObjectId, ref: "matchSchema", required: true},
    actor: {type: String, required: true},
    team: {type: String, required: true},
    message: {type: String, required: true},
    metadata: {type: Object }
    
}, {timestamps: true})

export const Commentary = mongoose.model("Commentary", matchCommentary);
