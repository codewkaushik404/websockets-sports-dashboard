import { ZodError } from "zod";

export default function errorHandler(err, req, res, next){
    console.error(err);
    if(err instanceof ZodError){
        const error = err.issues.map(issue => ({
                message: issue.message,
                path: issue.path
                })
            )
        return res.status(400).json({message: "Invalid data", error });
    }
    return res.status(err.statusCode || 500).json({message: err.message || "Internal Server Error"});
}