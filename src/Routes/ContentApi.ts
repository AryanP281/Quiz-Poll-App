
/**************************Imports************************/
import {Router} from "express"
import { addVoteToPoll, createPoll, getPoll, getUserPolls, addGuestVote } from "../Controllers/ContentController";
import { verifyUserToken } from "../Services/Middleware";

/**************************Variables**********************/
const router : Router = Router();

/**************************Routes**********************/
router.post("/createpoll", verifyUserToken, createPoll);
router.get("/poll/:pollId", getPoll);
router.put("/poll/vote", verifyUserToken, addVoteToPoll);
router.get("/userpolls", verifyUserToken, getUserPolls)
router.put("/poll/vote/guest", addGuestVote);

/**************************Exports**********************/
export default router;