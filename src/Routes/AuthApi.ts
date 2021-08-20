
/******************************Imports************************ */
import { Router } from "express";
import { authenticateUser, createUserAccount, signoutUser } from "../Controllers/AuthController";
import { verifyUserToken } from "../Services/Middleware";

/******************************Variables************************ */
const router : Router = Router();

/******************************Routes************************ */
router.get("/signout", verifyUserToken, signoutUser);
router.post("/signup", createUserAccount);
router.post("/signin", authenticateUser);

/******************************Exports************************ */
export default router;