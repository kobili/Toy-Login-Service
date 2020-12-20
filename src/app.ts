import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import {createDB, addNewUser, findUser} from './persistence';

const app: Application = express();

app.use(bodyParser.json())      // parse application/json data

// initialize user data
createDB();

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
 * 
 */

app.listen(5000, () => console.log("Server running @ http://localhost:5000"));