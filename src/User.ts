import { v4 as uuidv4 } from 'uuid';
const pool = require('./db');

interface User {
    email: string,
    uid: string,
    password: string
}

/**
 * @param email: the user's email
 * @param password : the user's hashed password 
 * Adds the new user to the user database
 * Returns the newly added user on success
 * Returns null on failure
 */
async function addNewUser(email: string, password: string): Promise<User | null> {

    try {
        let uid = uuidv4();

        let query = await pool.query(
            "INSERT INTO users (email, uid, password) VALUES($1, $2, $3) RETURNING *",
            [email, uid, password]
        );

        let retrievedUser = query.rows[0];

        let newUser: User = {
            email: retrievedUser.email,
            uid: retrievedUser.uid,
            password: retrievedUser.password
        };

        return newUser;
        
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

/**
 * @param email : the email of the user to be found
 * Finds the user with the given email in the database
 * Returns the user object with the corresponding email if it exists
 * Otherwise return null
 */
async function findUserByEmail(email: string): Promise<User | null>  {
    try {
        let query = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        
        if (query.rows.length === 0) {
            return null;
        }

        let retrievedUser = query.rows[0];

        let user : User = {
            email: retrievedUser.email,
            uid: retrievedUser.uid,
            password: retrievedUser.password
        };

        return user;

    } catch (error) {
        console.error(error.message);
        return null;
    }
}

/**
 * @param uuid : the id of the user to be found
 * Finds the user with the given id in the database
 * Returns the user object with the corresponding id if it exists
 * Otherwise return null
 */
async function findUserByID(uuid: string): Promise<User | null> {
    try {
        let query = await pool.query(
            "SELECT * FROM users WHERE uid = $1",
            [uuid]
        );
        
        if (query.rows.length === 0) {
            return null;
        }

        let retrievedUser = query.rows[0];

        let user : User = {
            email: retrievedUser.email,
            uid: retrievedUser.uid,
            password: retrievedUser.password
        };

        return user;

    } catch (error) {
        console.error(error.message);
        return null;
    }
}

export {addNewUser, findUserByEmail, findUserByID, User};