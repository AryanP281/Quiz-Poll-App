
/********************************Imports*********************** */
import bcrypt from "bcrypt"

/********************************Variables*********************** */
const saltRounds : number = 10; //The number of slat rounds for bcrypt hashing

/********************************Functions************************/
function hash(val : string) : Promise<string>
{
    /*Hashes the given value using bcrypt */

    return bcrypt.hash(val, saltRounds);
}

function compareHash(val : string, hashed : string) : Promise<boolean>
{
    /*Checks if the given value matches with the given hashed value */

    return bcrypt.compare(val, hashed);
}

/********************************Exports*********************** */
export {hash, compareHash};