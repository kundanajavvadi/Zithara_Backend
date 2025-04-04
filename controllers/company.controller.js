import { Company } from "../models/company.model.js";
import { Types } from "mongoose";
import mongoose from 'mongoose';


/**
 * @swagger
 * tags:
 *   - name: Company
 *     description: API for user management
 */

/**
 * @swagger
 * /company/register-company:
 *   post:
 *     summary: Register a new company
 *     tags: [Company]
 *     description: Registers a new company if the company name is not already taken
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 description: The name of the company
 *               description:
 *                 type: string
 *                 description: The description of the company
 *               website:
 *                 type: string
 *                 description: The company's website URL
 *               location:
 *                 type: string
 *                 description: The location of the company
 *     responses:
 *       201:
 *         description: Company successfully registered
 *       400:
 *         description: Company name is required or company already exists
 */
export const registerCompany = async (req, res) => {
    try {
        const { companyName, description, website, location } = req.body;
        const userId = req.user.userId;

        console.log('Received companyName:', companyName); 
        console.log('Received userId:', userId);  

        if (!companyName || !description || !website || !location) {
            console.log('One or more required fields are missing.');
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        console.log('Checking if company already exists...');
        let company = await Company.findOne({ name: companyName });
        if (company) {
            console.log('Company already exists:', company);
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log('Invalid userId:', userId);
            return res.status(400).json({
                message: "Invalid user ID.",
                success: false
            });
        }

        console.log('Creating new company with userId:', userId);
        company = await Company.create({
            name: companyName,
            description,
            website,
            location,
            userId: new Types.ObjectId(userId)
        });

        console.log('Company registered successfully:', company);
        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error('Error occurred while registering company:', error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false
        });
    }
};


/**
 * @swagger
 * /company/get-companies:
 *   get:
 *     summary: Get all companies for a user
 *     tags: [Company]
 *     description: Fetches a list of companies for the logged-in user
 *     responses:
 *       200:
 *         description: A list of companies for the user
 *       404:
 *         description: No companies found
 */
export const getCompany = async (req, res) => {
    try {
        

        // Query to fetch all companies for the logged-in user
        const companies = await Company.find();

        // If no companies are found, return a 404 response
        if (companies.length === 0) {
            return res.status(404).json({
                message: "No companies found.",
                success: false
            });
        }

        // Return the list of companies with a 200 OK response
        return res.status(200).json({
            companies,   // List of companies for the logged-in user
            success: true
        });
    } catch (error) {
        // Log and handle any internal errors
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false
        });
    }
};

/**
 * @swagger
 * /company/get-company/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Company]
 *     description: Fetch a specific company by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The company ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The company information
 *       404:
 *         description: Company not found
 */
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false
        });
    }
}

/**
 * @swagger
 * /company/update-company/{id}:
 *   put:
 *     summary: Update company information
 *     tags: [Company]
 *     description: Update the company details like name, description, website, location, and logo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The company ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the company
 *               description:
 *                 type: string
 *                 description: The description of the company
 *               website:
 *                 type: string
 *                 description: The company's website URL
 *               location:
 *                 type: string
 *                 description: The location of the company
 *     responses:
 *       200:
 *         description: Company information updated successfully
 *       400:
 *         description: Bad request, some required fields are missing
 *       404:
 *         description: Company not found
 */

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;  // Get all fields from body
        const companyId = req.params.id;  // Get the company ID from URL

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                message: "Invalid company ID.",
                success: false
            });
        }

        // Prepare the update object
        const updateData = { 
            name, 
            description, 
            website, 
            location
        };

        // Remove fields that are undefined or null to avoid updating them unnecessarily
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined || updateData[key] === null) {
                delete updateData[key];
            }
        });

        console.log('Updating company:', companyId, 'New data:', updateData);

        // Update the company document
        const company = await Company.findByIdAndUpdate(companyId, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated.",
            company,
            success: true
        });

    } catch (error) {
        console.error('Error updating company:', error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false
        });
    }
};
