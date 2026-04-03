import zod from "zod";

const time = zod.preprocess((arg) => {
    if(typeof arg === "string"){
        const date = new Date(arg);
        return isNaN(date.getTime()) ? undefined : date;  
    }
    else if(arg instanceof Date) return arg;
    return undefined;

}, zod.date({error: "Incorrect dates received"}));

export const createMatchValidation = zod.object({
    sport: zod.string().min(5, "Sport must be of 5 characters at least"),
    homeTeam: zod.string().min(1, "Team Name must be of 1 character at least"),
    awayTeam: zod.string().min(1, "Team Name must be of 1 character at least"),
    startTime: time, 
    endTime: time
}).refine((data) => data.endTime > data.startTime, {
    message: "End date time must be after start date time",
    path: ["endTime"]
})

