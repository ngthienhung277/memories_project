import express from "express";
import { googleAuth } from "../controllers/user.js";

const router = express.Router();

// Google authentication route
router.post("/google", googleAuth);

export default router; 