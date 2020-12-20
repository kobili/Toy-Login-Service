import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import {addNewUser, findUser} from './User';
import {connectDB} from './db'

const app: Application = express();

app.use(bodyParser.json())      // parse application/json data

// connect to database
connectDB();

/**
 * create a new user with an email and password
 * request body needs an email and password
 * response is the newly created user if successful, null otherwise
 */
app.post("/api/v1/user/register", (req: Request, res: Response) => {

    let email: string = req.body.email;
    let password: string = req.body.password

    if (addNewUser(email, password) === null) {
        return res.status(409).send({error: "Error: User already exists"});
    } else {
        return res.status(200).send({"email": email, "password": password});
    }
});

/**
 * Request body needs an email and password
 * Determines if email and password combo matches an entry in the database of users
 * TODO: add jwt signing on successful login
 */
app.post("/api/v1/user/login", (req: Request, res: Response) => {
    let email: string = req.body.email;
    let password: string = req.body.password;

    let user: any = findUser(email);     // the user with the corresponding email

    if (!user) {
        return res.status(404).send({err: "User not found"});
    }

    if (user.password === password) {
        console.log("Authentication successful");
        return res.status(501).send({err: "Authentication successful; Signing not yet implemented"});
    } else {
        return res.status(401).send({err: `Incorrect password for user: ${email}`});
    }
});


app.listen(5000, () => console.log("Server running @ http://localhost:5000"));