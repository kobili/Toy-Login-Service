import express, { Request, Response, NextFunction, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const pool = require('./db');

import {addNewUser, findUserByEmail, findUserByID, User} from './User';

const router: Router = express.Router();

router.use(express.json())                               // parse application/json data
router.use(express.urlencoded({ extended: false }));     // parse url encoded data

const superSecretAuthKey: string = "secret";                // the key used to sign and verify JWT tokens (dont tell anyone)

/**
 * create a new user with an email and password
 * request body needs an email and password
 * response is the newly created user if successful, null otherwise
 */
router.post("/register", async (req: Request, res: Response) => {

    let email: string = req.body.email;
    if ( await findUserByEmail(email)) {
        return res.status(409).send({error: "Error: User already exists"});
    }

    let password: string = req.body.password;

    // hash the concatenation of the user's email and password
    bcrypt.hash(email + password, 10, async (err, hash) => {
        if (err) {
            return res.status(500).send({err: "Problem registering user"});
        }

        let newUser : User | null = await addNewUser(email, hash);
        return res.json(newUser);
    });
});

/**
 * Request body needs an email and password
 * Determines if email and password combo matches an entry in the database of users
 */
router.post("/login", async (req: Request, res: Response) => {
    let email: string = req.body.email;
    let password: string = req.body.password;

    let user: User | null = await findUserByEmail(email);     // the user with the corresponding email

    if (!user) {
        return res.status(404).send({err: `No user found with email ${email}`});
    }

    // determine if the email and password are correct
    bcrypt.compare(email + password, user.password, (err, result) => {
        if (err) {
            return res.status(500).send({err: "There was a problem with logging you in"});
        }

        if (result) {

            // sign an auth token that expires in 24 hours
            // the payload is the id of the user trying to sign in
            let authToken = jwt.sign({uid: user?.uid}, superSecretAuthKey, {expiresIn: "24h"}); 

            return res.status(200).send({message: "Authentication successful", token: authToken});

        } else {
            return res.status(401).send({err: `Incorrect password for user: ${email}`});
        }
    });
});

/**
 * gets the information of the user currently logged in
 * Requires the token to be sent in the Request header as x-access-token
 * If the token is valid - then a response with status 200 is sent with the email and uuid of the user
 * If the token is invalid or missing then a response with status 401 is sent
 */
 router.get("/me", verifyToken, async (req: Request, res: Response) => {

    let uuid: string = req.body.uid;
    let user : User | null = await findUserByID(uuid);

    if (!user) {
        return res.status(404).send({err: "user not found"});
    }

    return res.status(200).send({email: user.email, uid: user.uid});
 });

 /**
  * Middleware which checks to see if the auth token is valid
  * If it is valid then attaches the decoded userID to the request body in a field called ID and calls the next function
  * If it is invalid then sends a 401 and a payload with details about the error
  */
 function verifyToken(req: Request, res: Response, next: NextFunction) {
     let token: any = req.headers['x-access-token'];

     if (!token) {
         // if the token is missing
         return res.status(401).send({err: "No token provided. Please sign in"});
     }

    // verify the provided token
    jwt.verify(token, superSecretAuthKey, (err: any, decoded: any) => {
        if (err) {
            // if the token is invalid or expired
            return res.status(401).send({err: err});
        }

        req.body.uid = decoded.uid;
        next();
    });
}

 export {router};