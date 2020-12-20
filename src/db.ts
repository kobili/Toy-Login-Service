import fs from "fs";
import path from "path";
import {User} from './User'

let dataPath = path.join(__dirname, "..", "data");
let userFilePath = path.join(dataPath, "users.json");

/**
 * create a json file to house all users' data if one doesn't already exist
 * file will be located at "../data/"
 */
function connectDB() {
    // check if user data already exists
    if (fs.existsSync(userFilePath)) {

        console.log("Reading existing User Database");
        return;

    } else {

        // create an empty user database
        let users: object[] = [];
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath);
        }
        fs.writeFileSync(userFilePath, JSON.stringify(users));
        console.log("User database generated!");

    }
}

/**
 * reads the JSON object stored in the json file housing user data
 */
function readDB(): User[] {
    let users: User[] = JSON.parse(fs.readFileSync(userFilePath, "utf-8"));
    return users;
}

export {dataPath, userFilePath, connectDB, readDB}