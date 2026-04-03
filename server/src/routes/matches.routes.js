import { Router } from "express";
import { getMatches, createMatch } from "../controllers/matches.controller.js";

const router = Router();

router.get("/", getMatches);
router.post("/", createMatch);

export default router;