import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import mongoose from "mongoose";
const { Types } = mongoose; 

/**
 * @swagger
 * tags:
 *   - name: Application
 *     description: API for user management
 */

/**
 * @swagger
 * /application/apply/{id}:
 *   post:
 *     summary: Apply for a job
 *     tags: [Application]
 *     description: User applies for a job
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The job ID to apply for
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Job applied successfully
 *       400:
 *         description: Job ID is required or already applied
 *       404:
 *         description: Job not found
 */



export const applyJob = async (req, res) => {
    try {
        const userId = req.user?.userId; // User ID from JWT or session
        let jobId = req.params.id?.trim(); // Trim to remove unwanted spaces

        if (!userId) {
            return res.status(400).json({ message: "User ID is missing.", success: false });
        }

        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required.", success: false });
        }

        // Validate if jobId and userId are valid MongoDB ObjectIds
        if (!mongoose.Types.ObjectId.isValid(jobId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid Job ID or User ID format.", success: false });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job.", success: false });
        }

        console.log(`Applying for job with ID: ${jobId}`);
        const newApplication = await Application.create({
            job: new mongoose.Types.ObjectId(jobId),
            applicant: new mongoose.Types.ObjectId(userId)
        });

        // Add the new application to the job's applications array
        if (!Array.isArray(job.applications)) job.applications = [];
        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({ message: "Job applied successfully.", success: true });
    } catch (error) {
        console.error("Error applying for job:", error);
        return res.status(500).json({ message: "Internal Server Error.", success: false });
    }
};


/**
 * @swagger
 * /application/get/appliedjobs:
 *   get:
 *     summary: Get applied jobs
 *     tags: [Application]
 *     description: Get all jobs that the user has applied for
 *     responses:
 *       200:
 *         description: Successfully retrieved applied jobs
 *       404:
 *         description: No applications found
 */
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(` userid ${userId}`)
        const application = await Application.find({ applicant: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        });
        if (!application) {
            return res.status(404).json({
                message: "No Applications",
                success: false
            });
        };
        return res.status(200).json({
            application,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

/**
 * @swagger
 * /application/{id}/applicants:
 *   get:
 *     summary: Get all applicants for a job
 *     tags: [Application]
 *     description: Admin gets all applicants who applied for a specific job
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The job ID to fetch applicants for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved applicants
 *       404:
 *         description: Job not found
 */
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });
        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            });
        };
        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

/**
 * @swagger
 * /application/status/{id}/update:
 *   put:
 *     summary: Update application status
 *     tags: [Application]
 *     description: Admin updates the status of an applicant's job application
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The application ID to update the status for
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Status is required
 *       404:
 *         description: Application not found
 */

export const updateStatus = async (req, res) => {
    try {
        console.log("Request Headers:", req.headers);
        console.log("Request Body:", req.body);  // Debugging

        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: 'Status is required',
                success: false
            });
        }
        const statusArray = ['pending', 'accepted', 'rejected'];
        console.log("shkfhs")
         if(!statusArray.includes(status))
         {
              return res.status(400).json({
                 message:  `Invalid status value  ${status}.Allowed values are: 'pending', 'accepted', or 'rejected'.`,
                 success: false
             });
         }


        // Find the application
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // Update status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.error("Error updating status:", error);
        return res.status(500).json({
            message: "Internal Server Error.",
            success: false
        });
    }
};



