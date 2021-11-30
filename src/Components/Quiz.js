
/**************************Imports*********************** */
import { useEffect } from "react";
import toast from "react-hot-toast";
import {useSelector, useDispatch} from "react-redux"
import { useHistory, useParams } from "react-router";
import { apiBaseUrl } from "../Config/Config";
import { updateQuizState } from "../Redux/Slices/QuizSlice";

/**************************Variables*********************** */
const quizDetailsBaseUrl = `${apiBaseUrl}/content/quiz`; //The url to retrieve the quiz details

/**************************Components*********************** */
function Quiz()
{
    const quizId = useParams().quizId; //Getting the quiz id from the url parameter
    const quizDetails = useSelector((state) => state.quizDetails);
    const dispatch = useDispatch();
    const history = useHistory();

    console.log(quizDetails)

    useEffect(() => {
        //Loading the quiz details
        loadQuizDetails(quizId, dispatch)
    }, []);

    console.log(quizDetails)

    return (
        <div className="background" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <div id="quiz-box">
                <h2>{quizDetails.title.length ? quizDetails.title : "Loading"}</h2>
                <h4>By {quizDetails.creator.length ? quizDetails.creator : "Loading"}</h4>
                <div style={{width: "50%"}}>
                <h4 style={{float: "left"}}>{`Score: ${quizDetails.totalScore}`}</h4>
                <h4 style={{float: "right"}}>{`Questions: ${quizDetails.questions.length}`}</h4>
                </div>
                <button className="create-btn" style={{width: "50%"}} onClick={() => history.push(`/quiz/${quizId}/questions`)}>Start Quiz</button>
            </div>
        </div>    
    )
}

/**************************Functions*********************** */
function loadQuizDetails(quizId, dispatch)
{
    /*Loads and updates the quiz details */

    fetch(`${quizDetailsBaseUrl}/${quizId}}`, {
        method: "GET",
    })
    .then((resp) => {
        if(resp.status !== 200)
            throw Error(resp.status);
        return resp.json();
    })
    .then((data) => {
        if(!data.success)
            throw Error(data.code)

        const quiz = data.quizDetails;
        console.log(quiz)
        dispatch(updateQuizState({title: quiz.title, creator: quiz.creator, totalScore: quiz.score, questions: quiz.questions}))
    })
    .catch((err) => {
        console.log(err);
        toast("Failed to load quiz. Try again");
    })
}

/**************************Exports*********************** */
export default Quiz;