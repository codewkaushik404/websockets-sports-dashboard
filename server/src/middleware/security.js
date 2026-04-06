import { httpArcjet } from "../../arcjet.js"

export default async function securityMiddleware(req, res, next){
    if(!httpArcjet) throw new Error("http Arcjet configuration is required");
    const decision = await httpArcjet.protect(req);

    if(decision.isDenied()){
        if(decision.reason.isRateLimit()){
            return res.status(429).json({message: "Too many requests"});
        }

        else if (decision.reason.isBot()){
            return res.status(403).json({ message: "No bots allowed" }); 
        }
        else return res.status(403).json({ message: "Forbidden" });
    }
    next();
}