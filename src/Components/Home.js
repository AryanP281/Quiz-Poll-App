
/****************************Imports*********************** */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {loadUserData} from "../Components/UserProfile";
import { apiBaseUrl } from "../Config/Config";
import { setPolls } from "../Redux/Slices/UserDetailsSlice";
import {getCookies} from "../Services/Services";

/****************************Variables************************/
const getUserPollsApiUrl = `${apiBaseUrl}/content/userpolls`; //The api url to get the polls created by the current user 
const signOutApiUrl = `${apiBaseUrl}/auth/signout`; //The api url to sign out the user

/****************************Component************************/
function Home()
{
    
    const userDetails = useSelector((state) => state.userDetails); //The user details
    const dispatch = useDispatch();
    const history = useHistory();

    //Checking if the user has signed in
    const cookies = getCookies();
    if(!cookies.has("auth"))
        history.replace("/signin"); //Redirecting to signin page

    //Loading user data
    useEffect(() => {
        if(cookies.has("auth"))
        {
            //Loading the user details
            if(!userDetails.initialized)
                loadUserData(dispatch);
            
            //Loading the user polls
            loadUserPolls(dispatch)
        }
    }, []);

    console.log("Home")

    return (
        <div className="home">
            <SideBar history={history}/>
            <div className="dashboard">
                <TopBar userDetails={userDetails} history={history}/>
                <div className="user-polls-list">
                    <ContentList title={`${userDetails.username}'s Polls`}>
                        {userDetails.polls && <UserPollsTable userPolls={userDetails.polls} history={history}/>}
                    </ContentList>
                </div>
            </div>
        </div>
    );
}

function SideBar({history})
{
    
    return (
        <div className="side-nav-bar">
            <button onClick={() => history.push("/newpoll")}>Create New Poll</button>
            <button onClick={() => history.push("/editprofile")}>Edit Profile</button>
            <button onClick={() => signoutUser(history)}>Log out</button>
        </div>
    );
}

function TopBar(props)
{
    const userDetails = props.userDetails;
    const history = props.history;

    return (
        <div className="top-bar">
            <div style={{flexBasis: "70%", flexGrow: "2"}}></div>
            {userDetails.initialized && <div className="profile-details">
                <h3>{userDetails.username}</h3>
                <img className="user-pic" src={userDetails.profilePic} onClick={() => history.push("/editprofile")}></img>
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
            pollDetails.push(<button onClick={() => props.history.push(`/poll/${poll.id}`)}>{poll.name}</button>);
            pollDetails.push(<h3>{`${poll.votes} votes`}</h3>)
        });
        return pollDetails;
    }
    
    return (
        <div className="user-polls-table">
            <div className="user-polls-headers">
                <h2 style={{borderRight: "2px solid white"}}>Poll Tile</h2>
                <h2>Vote Counts</h2>
            </div>        
            <div className="user-polls-grid">
                {displayPollDetails()}
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

function signoutUser(history)
{
    /*Signs out the user */

    fetch(signOutApiUrl, {
        method: "GET",
        credentials: "include"
    })
    .then((resp) => {
        if(resp.status !== 200)
            throw Error(resp);
        history.replace("/signin");
    })
    .catch((err) => {
        console.log(err);
        alert("Failed to sign out. Try again");
    });
}

/****************************Exports*********************** */
export default Home;