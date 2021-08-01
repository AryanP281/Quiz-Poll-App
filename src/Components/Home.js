
/****************************Imports*********************** */
import { useHistory } from "react-router-dom";

/****************************Component************************/
function Home()
{
    const history = useHistory();

    return (
        <div className="home">
            <button onClick={() => history.push("/editprofile")}>Edit Profile</button>
            <button onClick={() => history.push("/newpoll")}>New Poll</button>
        </div>
    );
}

/****************************Functions*********************** */

/****************************Exports*********************** */
export default Home;