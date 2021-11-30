
/******************************Imports**************************** */
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import {setTitle, setTotalScore} from "../Redux/Slices/NewQuizSlice";
import {authStatus} from "../Config/Config";

/******************************Components**************************** */
let redirected = false; //Semaphore to control redirection to login page

/******************************Components**************************** */
function NewQuiz()
{
    const quizDetails = useSelector((state) => state.newQuizDetails);
    const dispatch = useDispatch();
    const history = useHistory();

    //Checking if the user has signed in
    const userAuthStatus = sessionStorage.getItem("authStatus");
    if((userAuthStatus === null || userAuthStatus !== authStatus.logged) && !redirected)
    {
        redirected = true;
        toast("Please login to create quiz");
        history.replace("/signin");
        return null
    }

    return (
        <div className="new-quiz">
            <div id="details">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    history.push("/newquiz/questions");
                }}>
                    <input className="textbox" id="quiz-title" type="text" placeholder="Enter Quiz Title" 
                    value={quizDetails.title} onChange={(e) => dispatch(setTitle(e.target.value))}/>
                    <input className="textbox" id="quiz-score" type="number" placeholder="Enter Quiz Total Score" 
                    value={quizDetails.totalScore} onChange={(e) => dispatch(setTotalScore(e.target.value))}/>
                    <div>
                        <button type="submit" className="create-btn" >Add Questions</button>
                        <button type="submit" className="create-btn" >Save Quiz</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

/******************************Functions**************************** */

/******************************Exports**************************** */
export default NewQuiz;

