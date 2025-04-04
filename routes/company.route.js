import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";


const router = express.Router();

router.route("/company/register-company").post(isAuthenticated,registerCompany);
router.route("/company/get-companies").get(isAuthenticated,getCompany);
router.route("/company/get-company/:id").get(isAuthenticated,getCompanyById);
router.route("/company/update-company/:id").put(isAuthenticated, updateCompany);

export default router;

