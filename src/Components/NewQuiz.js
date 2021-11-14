
/******************************Imports**************************** */
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import {setTitle, setTotalScore, updateNewQuizState} from "../Redux/Slices/NewQuizSlice";

/******************************Components**************************** */
function NewQuiz()
{
    const quizDetails = useSelector((state) => state.newQuizDetails);
    const dispatch = useDispatch();
    const history = useHistory();

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

