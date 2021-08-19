
/**************************Imports************************/
import {Router} from "express"
import { addVoteToPoll, createPoll, getPoll, getUserPolls } from "../Controllers/ContentController";
import { verifyUserToken } from "../Services/Middleware";

/**************************Variables**********************/
const router : Router = Router();

/**************************Routes**********************/
router.post("/createpoll", verifyUserToken, createPoll);
router.get("/poll/:pollId", verifyUserToken, getPoll);
router.put("/poll/vote", verifyUserToken, addVoteToPoll);
router.get("/userpolls", verifyUserToken, getUserPolls)

/**************************Exports**********************/
export default router;