import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {addNewUser, findUser, User} from './User';
import {connectDB} from './db'

const app: Application = express();

app.use(bodyParser.json())      // parse application/json data
app.use(bodyParser.urlencoded({ extended: false })); // parse url encoded data

const superSecretAuthKey: string = "secret";        // the key used to sign and verify JWT tokens (dont tell anyone)

// connect to database
connectDB();

/**
 * create a new user with an email and password
 * request body needs an email and password
 * response is the newly created user if successful, null otherwise
 */
app.post("/api/v1/user/register", (req: Request, res: Response) => {

    let email: string = req.body.email;
    if (findUser(email)) {
        return res.status(409).send({error: "Error: User already exists"});
    }

    let password: string = req.body.password;

    // hash the concatenation of the user's email and password
    bcrypt.hash(email + password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send({err: "Problem registering user"});
        }

        let newUser = addNewUser(email, hash);
        return res.status(200).send({email: newUser?.email, id: newUser?.id});
    });
});

/**
 * Request body needs an email and password
 * Determines if email and password combo matches an entry in the database of users
 */
app.post("/api/v1/user/login", (req: Request, res: Response) => {
    let email: string = req.body.email;
    let password: string = req.body.password;

    let user: User | null = findUser(email);     // the user with the corresponding email

    if (!user) {
        return res.status(404).send({err: `No user found with email ${email}`});
    }

    // determine if the email and password are correct
    bcrypt.compare(email + password, user.password, (err, result) => {
        if (err) {
            return res.status(500).send({err: "There was a problem with logging you in"});
        }

        if (result) {
            console.log("Authentication successful");

            // sign an auth token that expires in 24 hours
            // the payload is the id of the user trying to sign in
            let authToken = jwt.sign({id: user?.id}, superSecretAuthKey, {expiresIn: 86400}); 

            return res.status(200).send({token: authToken});

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
 app.get("/api/v1/user/me", (req: Request, res: Response) => {
    let token: any = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({err: "No token provided. Please sign in"});
    }

    // verify the provided token
    // decoded["id"] will be the id of the user corresponding to the key
    jwt.verify(token, superSecretAuthKey, (err: any, decoded: any) => {
        if (err) {
            return res.status(500).send({err: "Error verifying token"});
        }

        let user = findUser(decoded["id"]);

        if (!user) {
            return res.status(401).send({err: "Invalid token: Try signing in again"});
        }

        return res.status(200).send({email: user?.email, id: user?.id});
    });
 });

app.listen(5000, () => console.log("Server running @ http://localhost:5000"));