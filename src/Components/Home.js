
/****************************Imports*********************** */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {loadUserData} from "../Components/UserProfile";
import { apiBaseUrl, authStatus } from "../Config/Config";
import { setPolls, resetDetails, setQuizzes } from "../Redux/Slices/UserDetailsSlice";
import defaultDp from "../Assets/Images/DefaultDp.png";
import {MdDeleteForever} from "react-icons/md";
import toast from "react-hot-toast";

/****************************Variables************************/
const getUserPollsApiUrl = `${apiBaseUrl}/content/userpolls`; //The api url to get the polls created by the current user 
const getUserQuizzesApiUrl = `${apiBaseUrl}/content/userquizzes`; //The api url to get the quizzes created by the current user
const deletePollApiBaseUrl = `${apiBaseUrl}/content/delete/poll`; //The api base url to delete polls
const deleteQuizApiBaseUrl = `${apiBaseUrl}/content/delete/quiz`; //The api base url to delete quizzes
const signOutApiUrl = `${apiBaseUrl}/auth/signout`; //The api url to sign out the user

/****************************Component************************/
function Home()
{
    
    const userDetails = useSelector((state) => state.userDetails); //The user details
    const dispatch = useDispatch();
    const history = useHistory();

    //Checking if the user has signed in
    const userAuthStatus = sessionStorage.getItem("authStatus");
    if(userAuthStatus === null || userAuthStatus === authStatus.notLogged)
    {
        history.replace("/signin"); //Redirecting to signin page
    }

    //Loading user data
    useEffect(() => {
        console.log()
        if(userAuthStatus === authStatus.logged)
        {
            //Loading the user details
            if(!userDetails.initialized)
                loadUserData(dispatch);
            
            //Loading the user polls
            loadUserPolls(dispatch);

            //Loading user quizzes
            loadUserQuizzes(dispatch);
        }
    }, []);

    console.log(userDetails)

    return (
        <div className="home">
            <div className="dashboard">
                <TopBar userDetails={userDetails} history={history} dispatch={dispatch}/>
                <div className="user-polls-list">
                    <ContentList title={`${userDetails.username}'s Polls`} history={history} newContentUrl="/newpoll">
                        {userDetails.polls && <UserPollsTable userPolls={userDetails.polls} history={history} dispatch={dispatch}/>}
                    </ContentList>
                </div>
                <div className="user-polls-list">
                    <ContentList title={`${userDetails.username}'s Quizzes`} history={history} newContentUrl="/newquiz">
                        {userDetails.quizzes && <UserQuizzesTable userQuizzes={userDetails.quizzes} history={history} dispatch={dispatch}/>}
                    </ContentList>
                </div>
            </div>
        </div>
    );
}

function SideBar({history, dispatch})
{
    
    return (
        <div className="side-nav-bar">
            <button onClick={() => history.push("/newpoll")}>Create New Poll</button>
            <button onClick={() => history.push("/editprofile")}>Edit Profile</button>
            <button onClick={() => signoutUser(history, dispatch)}>Log out</button>
        </div>
    );
}

function TopBar(props)
{
    const userDetails = props.userDetails;
    const history = props.history;

    return (
        <div className="top-bar">
        <button className="create-btn" onClick={() => signoutUser(history, props.dispatch)}>Logout</button>
            <div id="spacer"></div>
            {userDetails.initialized && <div className="profile-details">
                <h3>{userDetails.username}</h3>
                <img className="user-pic" src={userDetails.profilePic ? userDetails.profilePic : defaultDp} onClick={() => history.push("/editprofile")}></img>
            </div>}
        </div>
    );
}

function ContentList(props)
{

    return(
        <div className="content-list">
            <div className="content-list-title">
                <h3>{props.title}</h3>
                <button className="create-btn" onClick={() => props.history.push(props.newContentUrl)}>New</button>
            </div>
            <div className="content-list-content">
                {props.children}
            </div>
        </div>
    );
}

function UserPollsTable(props)
{

    const displayPollDetails = () => {
        const pollDetails = [];
        props.userPolls.forEach((poll) => {
            pollDetails.push(<button onClick={() => props.history.push(`/poll/${poll.pollid}`)}>{poll.title}</button>);
            pollDetails.push(<h3>{`${poll.votes}`}</h3>);
            pollDetails.push(<button onClick={() => deletePoll(poll.pollid, props.userPolls, props.dispatch)}> <MdDeleteForever /> </button>);
        });
        return pollDetails;
    }
    
    return (
        <div className="user-polls-table">
            <div className="user-polls-headers">
                <h2>Poll Title</h2>
                <h2>Vote Counts</h2>
                <h2>Delete</h2>
            </div>        
            <div className="user-polls-grid">
                {displayPollDetails()}
            </div>
        </div>
    );
}

function UserQuizzesTable(props)
{
    const displayQuizDetails = () => {
        const quizDetails = [];
        props.userQuizzes.forEach((quiz) => {
            quizDetails.push(<button onClick={() => props.history.push(`/quiz/${quiz.quizid}`)}>{quiz.title}</button>);
            quizDetails.push(<h3>{`${quiz.attempts}`}</h3>);
            quizDetails.push(<button onClick={() => deleteQuiz(quiz.quizid, props.userQuizzes, props.dispatch)}> <MdDeleteForever /> </button>);
        });
        return quizDetails;
    };

    return (
        <div className="user-polls-table">
            <div className="user-polls-headers">
                <h2>Quiz Title</h2>
                <h2>Attempt Counts</h2>
                <h2>Delete</h2>
            </div>        
            <div className="user-polls-grid">
                {displayQuizDetails()}
            </div>
        </div>
    );
}

/****************************Functions*********************** */
function loadUserPolls(dispatch)
{
    /*Loads info about the polls created by the user  */

    fetch(getUserPollsApiUrl, {
        method: "GET",
        credentials: "include"
    })
    .then((resp) => {
        if(resp.status !== 200)
            throw Error(resp.status);
        
        return resp.json();
    })
    .then((data) => {
        if(data.success)
            dispatch(setPolls({userPolls: data.polls}));
    })
    .catch((err) => {
        console.log(err);
    })
}

function loadUserQuizzes(dispatch)
{
    /* Loads info about the quizzes created by the user */

    fetch(getUserQuizzesApiUrl, {
        method: "GET",
        credentials: "include"
    })
    .then((resp) => {
        if(resp.status !== 200)
            throw new Error(resp.status);
        return resp.json();
    })
    .then((data) => {
        if(!data.success)
            throw new Error(data.code);
        dispatch(setQuizzes({userQuizzes: data.userQuizzes}));
    })
    .catch((err) => {
        console.log(err);
    })
}

function deletePoll(pollId, userPolls, dispatch)
{
    fetch(`${deletePollApiBaseUrl}/${pollId}`, {
        method: "DELETE",
        credentials: "include"
    })
    .then((resp) => {
        if(resp.status !== 200)
            throw new Error(resp.status);
        return resp.json();
    })
    .then((data) => {
        if(!data.success)
            throw new Error(data.code);
        
        //Updating the user polls
        const updatedState = [];
        userPolls.forEach((poll) => {
            if(poll.pollid !== pollId)
                updatedState.push(poll);
        });
        dispatch(setPolls({userPolls: updatedState}));
    })
    .catch((err) => {
        console.log(err);
        toast("Failed to delete poll. Try again");
    });
}

function deleteQuiz(quizId, userQuizzes, dispatch)
{
    fetch(`${deleteQuizApiBaseUrl}/${quizId}`, {
        method: "DELETE",
        credentials: "include"
    })
    .then((resp) => {
        if(resp.status !== 200)
            throw new Error(resp.status);
        return resp.json();
    })
    .then((data) => {
        if(!data.success)
            throw new Error(data.code);
        
        //Updating the user polls
        const updatedState = [];
        userQuizzes.forEach((quiz) => {
            if(quiz.quizid !== quizId)
                updatedState.push(quiz);
        });
        dispatch(setQuizzes({userQuizzes: updatedState}));
    })
    .catch((err) => {
        console.log(err);
        toast("Failed to delete poll. Try again");
    });
}

function signoutUser(history, dispatch)
{
    /*Signs out the user */

    fetch(signOutApiUrl, {
        method: "GET",
        credentials: "include"
    })
    .then((resp) => {
        if(resp.status !== 200)
            throw Error(resp);
        sessionStorage.setItem("authStatus", authStatus.notLogged);
        dispatch(resetDetails());
        history.replace("/signin");
    })
    .catch((err) => {
        console.log(err);
        alert("Failed to sign out. Try again");
    });
}

/****************************Exports*********************** */
export default Home;