
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/Signup";
import UserProfile from "./Components/UserProfile";
import Home from "./Components/Home";
import NewPoll from "./Components/NewPoll";

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

        </Switch>
      </div>
    </Router>
  );
}

export default App;
