import { Router } from "express";
import { getCommentary, createCommentary } from "../controllers/commentary.controller.js";
import isValidMongooseId from "../middleware/isValidId.js";

const router = Router({ mergeParams: true });

router.get("/", isValidMongooseId, getCommentary);
router.post("/", isValidMongooseId, createCommentary);

export default router;