
/**********************************Imports*******************************/
import { useState } from "react";
import { Link } from "react-router-dom";
import {apiBaseUrl, authStatus} from "../Config/Config";
import { emailRegex, getCookies } from "../Services/Services";
import { useHistory } from "react-router";

/**********************************Variables*******************************/
const signupUrl = `${apiBaseUrl}/auth/signup`; //The api url for creating user account
const errorMessages = ["Invalid email", "Password should be atleast 6 characters long", "Email already registered", "Failed to sign up. Try again"]; //The possible error messages to be displayed

/**********************************Component*******************************/
function SignUp()
{
    const [errorWord, setErrorWord] = useState(0);
    const history = useHistory();

    //Checking if the user is already signed in
    const userAuthStatus = sessionStorage.getItem("authStatus");
    if(userAuthStatus !== null)
    {
        if(userAuthStatus === authStatus.notLogged)
        {
            history.replace("/");
            return null;
        }
    }

    return(
        <div className="auth-page">
            <div className="auth-box">
                <div className="auth-creds-sec">
                    <h1>Quiz And Poll App</h1>
                    <h3>Hey there ! Signup to start making you own quizes and polls</h3>

                    <form onSubmit={(event) => {
                        event.preventDefault();
                        createUserAccount(setErrorWord, history);
                    }}>
                        <input type="text" id="email" placeholder="Enter email" className={(errorWord & 1 || errorWord & 4) ? "invalid-input" : ""} />
                        <input type="password" id="pss" placeholder="Enter password" className={(errorWord & 2) ? "invalid-input" : ""} />
                        <button type="submit">Sign Up</button>
                    </form>

                    <div className="error-messages">
                        {(errorWord !== 0) && displayErrorMessages(errorWord)}
                    </div>
                    
                    <h3>Already have an account ? <Link to="/signin"> Sign In </Link> </h3>

                </div>

                <div className="auth-anim-sec"> 
                    <h1>INSERT ANIMATION</h1>
                </div>

            </div>
        </div>
    );
}

/**********************************Function*******************************/
function createUserAccount(setErrorWord, history)
{
    /*Reads entered details and sends request to create user account */

    //Getting the entered user details
    const user = {
        email : document.getElementById("email").value.trim(),
        pss : document.getElementById("pss").value.trim()
    };

    //Checking if the entered details are valid
    const errorWord = validateDetails(user);
    if(errorWord !== 0)
    {
        setErrorWord(errorWord);
        return;
    }

    //Sending the request to create new account
    fetch(signupUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body : JSON.stringify({user})
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
                case 2 : setErrorWord(4); break;
                default : throw Error(data);
            }
        }
        else
        {
            //Updating the user auth status
            sessionStorage.authStatus("authStatus", authStatus.logged);

            //Redirecting to edit profile page
            history.replace("/editprofile");
        }
    })
    .catch((err) => {
        console.log(err);
        setErrorWord(8);
    });

}

function validateDetails(userDetails) 
{
    /*Checks if the provided user details are valid */

    let errorWord = 0; //The error word to keep track of the incorrect credentials

    //Checking email length and format
    errorWord |= (userDetails.email.length === 0 || userDetails.email.search(emailRegex) === -1);

    //Checking the password length
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
            errors.push((<h5 key={i}>{errorMessages[i]}</h5>));
    }

    return errors;
}

/**********************************Exports*******************************/
export default SignUp;
