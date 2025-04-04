import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
 
const router = express.Router();

router.route("/application/apply/:id").post(isAuthenticated, applyJob);
router.route("/application/get/appliedjobs").get(isAuthenticated, getAppliedJobs);
router.route("/application/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/application/status/:id/update").put(isAuthenticated, updateStatus);
 

export default router;