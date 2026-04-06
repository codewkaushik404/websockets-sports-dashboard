import { z as zod } from "zod";

const time = zod.preprocess((arg) => {
    if(typeof arg === "string"){
        const date = new Date(arg);
        return isNaN(date.getTime()) ? undefined : date;  
    }
    else if(arg instanceof Date) return arg;
    return undefined;

}, zod.date({error: "Incorrect dates received"}));

export const createMatchValidation = zod.object({
    sport: zod.string().trim().min(1, "Sport is required"),
    venue: zod.string().min(1, "Venue should be of at least 1 character"),
    homeTeam: zod.string().min(1, "Team Name must be of 1 character at least"),
    awayTeam: zod.string().min(1, "Team Name must be of 1 character at least"),
    startTime: time, 
    endTime: time
}).refine((data) => data.endTime > data.startTime, {
    message: "End date time must be after start date time",
    path: ["endTime"]
})

