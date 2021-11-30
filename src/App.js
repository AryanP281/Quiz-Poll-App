
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/Signup";
import UserProfile from "./Components/UserProfile";
import Home from "./Components/Home";
import NewPoll from "./Components/NewPoll";
import Poll from "./Components/Poll";
import NewQuiz from "./Components/NewQuiz";
import NewQuizQuestions from "./Components/NewQuizQuestions";
import Quiz from "./Components/Quiz";
import { Toaster } from "react-hot-toast";
import QuizQuestion from "./Components/QuizQuestion";

function App() 
{

  return (
    <Router>
      <div className="App">
      
        <Switch>
        
          <Route exact path="/">
            <Home />
          </Route>

          <Route exact path="/signup">
            <SignUp />
          </Route>

          <Route exact path="/signin">
            <SignIn />
          </Route>

          <Route exact path="/editprofile">
            <UserProfile />
          </Route>

          <Route exact path="/newpoll">
            <NewPoll />
          </Route>

          <Route exact path="/newquiz">
            <NewQuiz />
          </Route>

          <Route exact path="/newquiz/questions">
            <NewQuizQuestions />
          </Route>

          <Route path="/poll/:pollId">
            <Poll />
          </Route>

          <Route path="/quiz/:quizId/questions">
            <QuizQuestion />
          </Route>

          <Route path="/quiz/:quizId">
            <Quiz />
          </Route>

        </Switch>

        <Toaster toastOptions={{duration: 4000, position: "top-center", style: {backgroundColor: "#7F00FF", color: "white"}}}/>
      </div>
    </Router>
  );
}

export default App;
