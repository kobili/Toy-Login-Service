"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByID = exports.findUserByEmail = exports.addNewUser = void 0;
const db_1 = require("./db");
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
/**
 * @param email: the user's email
 * @param password : the user's password (TODO: add password encrypting)
 * Adds the new user to the user database if it didn't already exist
 * Returns the newly added user on success
 * Returns null on failure
 */
function addNewUser(email, password) {
    let users = db_1.readDB();
    // ensure no two users can have the same email
    if (findUserByEmail(email) != null) {
        console.log("User already exists");
        return null;
    }
    let userID = uuid_1.v4();
    let newUser = {
        "email": email,
        "id": userID,
        "password": password
    };
    users.push(newUser);
    fs_1.default.writeFileSync(db_1.userFilePath, JSON.stringify(users));
    console.log("User added");
    return newUser;
}
exports.addNewUser = addNewUser;
/**
 * @param email : the email of the user to be found
 * Finds the user with the given email in the database
 * Returns the user object with the corresponding email if it exists
 * Otherwise return null
 */
function findUserByEmail(email) {
    let users = db_1.readDB();
    // iterate through each existing user and see if one of them has the given email
    for (let user of users) {
        if (user.email === email) {
            return user;
        }
    }
    // no user found
    return null;
}
exports.findUserByEmail = findUserByEmail;
/**
 * @param uuid : the id of the user to be found
 * Finds the user with the given id in the database
 * Returns the user object with the corresponding id if it exists
 * Otherwise return null
 */
function findUserByID(uuid) {
    let users = db_1.readDB();
    // iterate through each existing user and see if one of them has the given email
    for (let user of users) {
        if (user.id === uuid) {
            return user;
        }
    }
    // no user found
    return null;
}
exports.findUserByID = findUserByID;
