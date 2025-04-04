import { Job } from "../models/job.model.js";
//import { Types } from "mongoose";
import mongoose from "mongoose";
const { Types } = mongoose; 

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the job.
 *         title:
 *           type: string
 *           description: The title of the job.
 *         description:
 *           type: string
 *           description: Detailed description of the job.
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *           description: List of job requirements.
 *         salary:
 *           type: number
 *           description: The salary for the job.
 *         location:
 *           type: string
 *           description: The location of the job.
 *         jobType:
 *           type: string
 *           description: The type of job (e.g., full-time, part-time).
 *         experienceLevel:
 *           type: integer
 *           description: Required experience level.
 *         position:
 *           type: string
 *           description: The position of the job.
 *         company:
 *           type: string
 *           description: The company posting the job.
 *         created_by:
 *           type: string
 *           description: The user who created the job (admin).
 *       required:
 *         - title
 *         - description
 *         - requirements
 *         - salary
 *         - location
 *         - jobType
 *         - experienceLevel
 *         - position
 *         - company
 *         - created_by
 */

/**
 * @swagger
 * /job/admin/post-job:
 *   post:
 *     summary: Admin can create a new job
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the job.
 *               description:
 *                 type: string
 *                 description: Detailed description of the job.
 *               requirements:
 *                 type: string
 *                 description: Comma separated list of job requirements.
 *               salary:
 *                 type: number
 *                 description: The salary for the job.
 *               location:
 *                 type: string
 *                 description: The location of the job.
 *               jobType:
 *                 type: string
 *                 description: The type of job (e.g., full-time, part-time).
 *               experience:
 *                 type: string
 *                 description: Required experience level.
 *               position:
 *                 type: string
 *                 description: The position of the job.
 *               companyId:
 *                 type: string
 *                 description: ID of the company posting the job.
 *     responses:
 *       201:
 *         description: Job created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Bad request due to missing fields.
 *       500:
 *         description: Internal server error.
 */
export const postJob = async (req, res) => {
    try {
        // Check if the user is an admin
        const userRole = req.user.role;  // Assuming `req.user` contains role data
        
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: "You are not authorized to post a job.",
                success: false
            });
        }

        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        const experienceLevel = parseInt(experience, 10);

        // Create the job
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel,
            position,
            company: new Types.ObjectId(companyId),
            created_by: new Types.ObjectId(userId)
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

/**
 * @swagger
 * /job/get/jobs:
 *   get:
 *     summary: Get all available jobs for students
 *     tags: [Jobs]
 *     parameters:
 *       - name: keyword
 *         in: query
 *         description: Search jobs by keyword in title or description.
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Jobs not found.
 */
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

/**
 * @swagger
 * /job/get/jobs/{id}:
 *   get:
 *     summary: Get a specific job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Job ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Job not found.
 */
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
};

/**
 * @swagger
 * /job/admin/jobs:
 *   get:
 *     summary: Get all jobs created by the admin
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: A list of jobs created by the admin.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Jobs not found.
 */
export const getAdminJobs = async (req, res) => {
    try {
        const userRole = req.user.role;  // Assuming user role is stored in req.user object

        // Check if the user is an admin
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: "Access denied. Only admins can view jobs.",
                success: false
            });
        }

        const adminId = req.user.userId;  // Assuming admin's ID is stored in req.id
        const jobs = await Job.find({ created_by: new Types.ObjectId(adminId) })
            .populate({
                path: 'company'
            })
            .sort({ createdAt: -1 });  // Sorting by createdAt to get the most recent jobs first

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
