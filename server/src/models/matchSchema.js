import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({

    sport: {type: String, required: true},
    venue: {type: String, required: true},
    homeTeam: {type: String, required: true},
    awayTeam: {type: String, required: true},
    homeTeamScore: {type: Number, default: 0},
    awayTeamScore: {type: Number, default: 0},
    startTime: {
        type: Date, 
        required: true
    },
    endTime: {
        type: Date,
        validate: {
            validator: function(d){ return this.startTime && d > this.startTime }
        },
        required: true
    },
    status: {type: String, enum: ["scheduled", "ended", "live"]}

}, {timestamps: true});

matchSchema.pre("save", function(){
    const now = new Date();
    if(now < this.startTime) this.status = "scheduled";
    else if(now >= this.endTime) this.status = "ended";
    else this.status = "live";

});

const Matches = mongoose.model("Matches", matchSchema);
export default Matches;