
/******************************Imports************************ */
import { Router } from "express";
import { authenticateUser, createUserAccount } from "../Controllers/AuthController";

/******************************Variables************************ */
const router : Router = Router();

/******************************Routes************************ */
router.post("/signup", createUserAccount);
router.post("/signin", authenticateUser);

/******************************Exports************************ */
export default router;