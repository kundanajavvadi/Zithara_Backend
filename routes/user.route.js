import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();


router.route("/user/register").post( register);
router.route("/user/login").post(login);
router.route("/user/logout").post(logout);
router.route("/user/update-profile/:userId").put(isAuthenticated,  updateProfile);  

export default router;
