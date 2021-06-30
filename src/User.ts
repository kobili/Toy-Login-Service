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

        let newUser: User = {
            email: query.rows[0].email,
            uid: query.rows[0].uid,
            password: query.rows[0].password
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
// async function findUserByEmail(email: string): Promise<User | null>  {
//     try {
        
//     } catch (error) {
//         console.log(error.message);
//         return null;
//     }
// }

// /**
//  * @param uuid : the id of the user to be found
//  * Finds the user with the given id in the database
//  * Returns the user object with the corresponding id if it exists
//  * Otherwise return null
//  */
// function findUserByID(uuid: string): User | null {
    
// }

export {addNewUser, /*findUserByEmail, findUserByID,*/ User};