
/********************************Imports*********************** */
import fileStream from "fs";

/********************************Variables*********************** */
const responseCodes : any = {
    success : 0,
    invalid_credentials : 1,
    email_already_registered : 2,
    user_not_found : 3,
    incorrect_password : 4,
    invalid_token : 5,
    invalid_user_details: 6
};
let JWT_SECRET : string | undefined;

/********************************Script*********************** */

//Getting the config file data
const configFileData = fileStream.readFileSync("./src/Config/Config.txt", "utf-8").split("\n");

//Setting the jwt secret
JWT_SECRET = configFileData[0];

/********************************Exports*********************** */
export {responseCodes, JWT_SECRET};