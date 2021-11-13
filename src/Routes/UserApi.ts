
/********************************Imports*********************** */
import { Router } from "express";
import { checkUserVote, editUserDetails, getUserProfile, getUserScore } from "../Controllers/UserController";
import { verifyUserToken } from "../Services/Middleware";
import { multerUploader } from "../Config/App";

/********************************Variables*********************** */
const router : Router = Router();

/********************************Routes*********************** */
router.put("/editprofile", multerUploader.single("profilePic"), verifyUserToken,editUserDetails);
router.get("/profile", verifyUserToken, getUserProfile);
router.get("/voted/:pollId", verifyUserToken, checkUserVote);
router.get("/quizresults", verifyUserToken, getUserScore);

/********************************Exports*********************** */
export default router;