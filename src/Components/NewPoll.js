/******************************Imports**************************** */
import {useState} from "react";
import {FcDeleteRow, FcAddRow} from "react-icons/fc";
import { useHistory } from "react-router-dom";

/******************************Variables**************************** */
let newOptionId = 0; //The id for new option. Its unique for each option

/******************************Components**************************** */
function NewPoll()
{
    const [options, setOptions] = useState([]);
    const history = useHistory();

    console.log("New Poll")
    console.log(options)

    return(
        <div className="new-poll">
            <div className="new-poll-box">
                <div className="box-title-bar">
                    <button onClick={() => history.push("/")}>Home</button>
                    <h1>New Poll</h1>
                    <div />
                </div>
                <form onSubmit={(event) => {
                    event.preventDefault();
                }}>
                    <input type="text" placeholder="Enter Question" />
                    <div>
                        {options.map((option) => <NewPollOption key={option.id} option={option} options={options} setOptions={setOptions}/>)}
                    </div>
                    <div id="new-option-btn-container">
                        <button id="new-option-btn" onClick={() => addNewOption(options, setOptions)}> <FcAddRow size={40}/> </button>
                    </div>

                    <button type="submit">Create Poll</button>
                </form>
            </div>
        </div>
    );
}

function NewPollOption(props)
{
    const option = props.option;

    return (
        <div className="new-poll-option">
            <input type="text" onChange={(e) => option.txt= e.target.value} placeholder={option.txt.length ? option.txt : "Enter new option"} style={{flexBasis: "90%", flexGrow: "2"}}/>
            <button onClick={() => deleteOption(option, props.options, props.setOptions)}>
                <FcDeleteRow size={40}/>
            </button>
        </div>
    )
}

/******************************Functions**************************** */
function addNewOption(options, setOptions)
{
    /*Adds a new blank option to the options list*/

    const newOptions = [];
    options.forEach((option) => {
        newOptions.push({id: option.id, txt: option.txt})
    });
    newOptions.push({id: newOptionId, txt: ""});
    newOptionId++;

    setOptions(newOptions);
}

function deleteOption(option, options, setOptions)
{
    /*Deletes the given option*/

    const newOptions = [];
    options.forEach((opt) => {
        if(opt.id !== option.id)
            newOptions.push(opt);
    });

    setOptions(newOptions);
}

/******************************Exports**************************** */
export default NewPoll;