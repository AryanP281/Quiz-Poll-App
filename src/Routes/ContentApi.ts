
/**************************Imports************************/
import {Router} from "express"
import { addVoteToPoll, createPoll, getPoll, getUserPolls, addGuestVote, createQuiz, saveUserQuizResults, getQuiz, 
    getGuestQuizResults, getUserQuizResults, checkUserAttemptedQuiz, getUserQuizzes, deletePoll, deleteQuiz } from "../Controllers/ContentController";
import { verifyUserToken } from "../Services/Middleware";

/**************************Variables**********************/
const router : Router = Router();

/**************************Routes**********************/
router.post("/createpoll", verifyUserToken, createPoll);
router.get("/poll/:pollId", getPoll);
router.put("/poll/vote", verifyUserToken, addVoteToPoll);
router.get("/userpolls", verifyUserToken, getUserPolls)
router.get("/userquizzes", verifyUserToken, getUserQuizzes);
router.put("/poll/vote/guest", addGuestVote);
router.post("/createquiz", verifyUserToken, createQuiz);
router.put("/submitquiz", verifyUserToken, saveUserQuizResults);
router.get("/getquizresults/:quizId", verifyUserToken, getUserQuizResults);
router.get("/quiz/:quizId", getQuiz);
router.put("/getquizresults/guest", getGuestQuizResults);
router.get("/attemptedquiz/:quizId", verifyUserToken, checkUserAttemptedQuiz);
router.delete("/delete/poll/:pollId", verifyUserToken, deletePoll);
router.delete("/delete/quiz/:quizId", verifyUserToken, deleteQuiz);

/**************************Exports**********************/
export default router;