
/********************************Imports*********************** */
import { Router } from "express";
import { editUserDetails, getUserProfile } from "../Controllers/UserController";
import { verifyUserToken } from "../Services/Middleware";

/********************************Variables*********************** */
const router : Router = Router();

/********************************Routes*********************** */
router.put("/editprofile", verifyUserToken, editUserDetails);
router.get("/profile", verifyUserToken, getUserProfile);

/********************************Exports*********************** */
export default router;