import {userFilePath, readDB} from './db';
import fs from 'fs';

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

export {addNewUser, findUser};