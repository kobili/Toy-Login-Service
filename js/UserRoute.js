"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("./User");
const router = express_1.default.Router();
exports.router = router;
router.use(body_parser_1.default.json()); // parse application/json data
router.use(body_parser_1.default.urlencoded({ extended: false })); // parse url encoded data
const superSecretAuthKey = "secret"; // the key used to sign and verify JWT tokens (dont tell anyone)
/**
 * create a new user with an email and password
 * request body needs an email and password
 * response is the newly created user if successful, null otherwise
 */
router.post("/register", (req, res) => {
    let email = req.body.email;
    if (User_1.findUserByEmail(email)) {
        return res.status(409).send({ error: "Error: User already exists" });
    }
    let password = req.body.password;
    // hash the concatenation of the user's email and password
    bcrypt_1.default.hash(email + password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send({ err: "Problem registering user" });
        }
        let newUser = User_1.addNewUser(email, hash);
        return res.status(200).send({ email: newUser === null || newUser === void 0 ? void 0 : newUser.email, id: newUser === null || newUser === void 0 ? void 0 : newUser.id });
    });
});
/**
 * Request body needs an email and password
 * Determines if email and password combo matches an entry in the database of users
 */
router.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let user = User_1.findUserByEmail(email); // the user with the corresponding email
    if (!user) {
        return res.status(404).send({ err: `No user found with email ${email}` });
    }
    // determine if the email and password are correct
    bcrypt_1.default.compare(email + password, user.password, (err, result) => {
        if (err) {
            return res.status(500).send({ err: "There was a problem with logging you in" });
        }
        if (result) {
            console.log("Authentication successful");
            // sign an auth token that expires in 24 hours
            // the payload is the id of the user trying to sign in
            let authToken = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user.id }, superSecretAuthKey, { expiresIn: "24h" });
            return res.status(200).send({ message: "Authentication successful", token: authToken });
        }
        else {
            return res.status(401).send({ err: `Incorrect password for user: ${email}` });
        }
    });
});
/**
 * gets the information of the user currently logged in
 * Requires the token to be sent in the Request header as x-access-token
 * If the token is valid - then a response with status 200 is sent with the email and uuid of the user
 * If the token is invalid or missing then a response with status 401 is sent
 */
router.get("/me", verifyToken, (req, res) => {
    let uuid = req.body.ID;
    let user = User_1.findUserByID(uuid);
    if (!user) {
        return res.status(404).send({ err: "user not found" });
    }
    return res.status(200).send({ email: user.email, id: user.id });
});
/**
 * Middleware which checks to see if the auth token is valid
 * If it is valid then attaches the decoded userID to the request body in a field called ID and calls the next function
 * If it is invalid then sends a 401 and a payload with details about the error
 */
function verifyToken(req, res, next) {
    let token = req.headers['x-access-token'];
    if (!token) {
        // if the token is missing
        return res.status(401).send({ err: "No token provided. Please sign in" });
    }
    // verify the provided token
    jsonwebtoken_1.default.verify(token, superSecretAuthKey, (err, decoded) => {
        if (err) {
            // if the token is invalid or expired
            return res.status(401).send({ err: err });
        }
        req.body.ID = decoded.id;
        next();
    });
}
