
/*************************Imports*********************** */
import { useState } from "react";
import { emailRegex, getCookies } from "../Services/Services";
import {apiBaseUrl, authStatus} from "../Config/Config";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthStatus } from "../Redux/Slices/UserDetailsSlice";

/*************************Variables*********************** */
const getTokenApiUrl = `${apiBaseUrl}/auth/signin`; //The api url to get user access token
const errorMessages = ["Invalid email", "Invalid password", "User not found", "Incorrect Password", "Failed to login. Try again"]; //The possible error messages to be displayed

/*************************Component*********************** */
function SignIn()
{
    const [errorWord, setErrorWord] = useState(0);
    const history = useHistory();

    //Checking if the user is already signed in
    const userAuthStatus = sessionStorage.getItem("authStatus"); //Getting the user auth status
    if(userAuthStatus !== null)
    {
        if(userAuthStatus === authStatus.logged)
        {
            history.replace("/"); //Redirecting to home page
            return null;
        }
    }

    console.log("signin")
    
    return (
        <div className="auth-page">
            <div className="auth-box">
                <div className="auth-creds-sec">
                    <h1>Quiz And Poll App</h1>
                    <h3>Welcome back ! Sign in to continue</h3>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        loginUser(setErrorWord, history);
                    }}>
                        <input type="text" id="email" placeholder="Enter email" className={(errorWord & 1 || errorWord & 4) ? "invalid-input" : ""} />
                        <input type="password" id="pss" placeholder="Enter password" className={(errorWord & 2 || errorWord & 8) ? "invalid-input" : ""} />
                        <button type="submit">Sign In</button>
                    </form>

                    <div className="error-messages">
                        {(errorWord !== 0) && displayErrorMessages(errorWord)}
                    </div>
                    
                    <h3>Don't have an account ? <Link to="/signup"> Sign Up </Link> </h3>

                </div>

                <div className="auth-anim-sec">
                
                </div>

            </div>
        </div>
    );
}

/*************************Functions*********************** */
function loginUser(setErrorWord, history)
{
    /*Validates the entered details and requests for auth token */

    //Getting the entered details
    const user = {
        email : document.getElementById("email").value.trim(),
        pss : document.getElementById("pss").value.trim()
    }; 
    
    //Validating the details
    const errorWord = validateDetails(user);
    if(errorWord !== 0)
    {
        setErrorWord(errorWord);
        return;
    }

    //Getting jwt from backend
    fetch(getTokenApiUrl, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        credentials: "include",
        body: JSON.stringify({user})
    })
    .then((resp) => {
        if(resp.status !== 200)
            throw Error(resp.status);
        
        return resp.json();
    })
    .then((data) => {
        if(!data.success)
        {
            switch(data.code)
            {
                case 1 : setErrorWord(3); break;
                case 3 : setErrorWord(4); break;
                case 4 : setErrorWord(8); break;
                default : throw Error(data);
            }
        }
        else
        {
            //Updating the user auth status
            sessionStorage.setItem("authStatus", authStatus.logged);

            //Redirecting to home page
            history.replace("/");
        }
    })
    .catch((err) => {
        console.log(err);
        setErrorWord(16);
    })

}

function validateDetails(userDetails)
{
    /*Checks if the entered user details are valid*/

    let errorWord = 0;

    //Checking email
    errorWord |= (userDetails.email.length === 0 || userDetails.email.search(emailRegex) === -1);

    //Checking password
    errorWord |= (userDetails.pss.length < 6) << 1;

    return errorWord;
}

function displayErrorMessages(errorWord)
{
    /*Returns the error messages to be dislayed*/

    const errors = [];

    for(let i = 0; i < errorMessages.length; ++i)
    {
        if(errorWord & (1 << i))
            errors.push((<h5 key={i} className="error-message">{errorMessages[i]}</h5>));
    }

    return errors;
}

/*************************Exports*********************** */
export default SignIn;