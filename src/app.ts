import express, { Application } from 'express';
import {router as UserRoute} from './UserRoute'

const app: Application = express();

// use routes for user endpoints
app.use("/api/v1/user", UserRoute);

// start the server
app.listen(5000, () => console.log("Server running @ http://localhost:5000"));