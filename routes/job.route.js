import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/job/admin/post-job").post(isAuthenticated, postJob);
router.route("/job/get/jobs").get(isAuthenticated, getAllJobs);
router.route("/job/admin/jobs").get(isAuthenticated, getAdminJobs);
router.route("/job/get/jobs/:id").get(isAuthenticated, getJobById);

export default router;

