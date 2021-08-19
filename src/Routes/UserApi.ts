
/********************************Imports*********************** */
import { Router } from "express";
import { editUserDetails, getUserProfile } from "../Controllers/UserController";
import { verifyUserToken } from "../Services/Middleware";
import { multerUploader } from "../Config/App";

/********************************Variables*********************** */
const router : Router = Router();

/********************************Routes*********************** */
router.put("/editprofile", multerUploader.single("profilePic"), verifyUserToken,editUserDetails);
router.get("/profile", verifyUserToken, getUserProfile);

/********************************Exports*********************** */
export default router;