import { z as zod } from "zod";

//zod.object -> when u know the keys beforehand
//zod.metadata -> when u dont know the keys beforehand (here i defined keys are strings and values any type )
export const commentaryValidation = zod.object({
    eventType: zod.string().min(1, "event Type should be of at least 1 character"),
    actor: zod.string().min(1, "actor should be of at least 1 character"),
    team: zod.string().min(1, "Team Name should be of at least 1 character"),
    message: zod.string().min(3, "Commentary should be of at least 3 characters"),
    period: zod.string().min(1, "Match period should be of at least 1 character"),    
    tags: zod.array(zod.string().min(1, "Tags should have at least 1 character")),
    metadata: zod.record(zod.string(), zod.unknown()).optional()
})