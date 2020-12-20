import fs from "fs";
import path, { dirname } from "path";

let dataPath = path.join(__dirname, "..", "data");
let userFilePath = path.join(dataPath, "users.json");

/**
 * create a json file to house all users' data if one doesn't already exist
 * file will be located at "../data/"
 */
function createDB() {
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
function readDB(): object[] {
    let users: object[] = JSON.parse(fs.readFileSync(userFilePath, "utf-8"));
    return users;
}

/**
 * @param email: the user's email
 * @param password : the user's password (TODO: add password encrypting)
 * Adds the new user to the user database if it didn't already exist
 * Returns the newly added user on success
 * Returns null on failure
 */
function addNewUser(email: string, password: string): object | null {
    let users: object[] = readDB();

    // ensure no two users can have the same email
    if (findUser(email) != null) {
        console.log("User already exists");
        return null;
    }

    let newUser: object = {
        "email": email,
        "password": password
    };

    users.push(newUser);
    fs.writeFileSync(userFilePath, JSON.stringify(users));
    console.log("User added");

    return newUser;
}

/**
 * @param email : the email of the user to be found
 * Finds the user with the given email in the database
 * Returns the user object with the corresponding email if it exists
 * Otherwise return null
 */
function findUser(email: string): object | null  {
    let users: any[] = readDB();

    // iterate through each existing user and see if one of them has the given email
    for (let user of users) {
        if (user.email === email) {
            return user;
        }
    }

    // no user found
    return null;
}

export {createDB, addNewUser, findUser};