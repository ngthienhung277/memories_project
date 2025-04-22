import express from "express";
import {
    signin,
    signup,
    googleAuth,
    getUser,
    updateUser,
    deleteUser,
    changePassword,
    forgotPassword,
    resetPassword,
    getUserLikes,
    increaseLikes,
    decreaseLikes,
    getLikedPosts
} from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Auth routes
router.post("/signin", signin);
router.post("/signup", signup);
router.post("/google", googleAuth);

// User management routes
router.get("/:id", auth, getUser);
router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

// Password management routes
router.post("/:id/change-password", auth, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Likes management routes
router.get("/:id/likes", auth, getUserLikes);
router.post("/:id/likes", auth, increaseLikes);
router.delete("/:id/likes", auth, decreaseLikes);
router.get("/:id/liked-posts", auth, getLikedPosts);

export default router; 