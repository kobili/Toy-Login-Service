import express, { Application, Request, Response, NextFunction, Router } from 'express';

import {connectDB} from './db'
import {router as UserRoute} from './UserRoute'

const app: Application = express();

// connect to database
connectDB();

// use routes for user endpoints
app.use("/api/v1/user", UserRoute);

// start the server
app.listen(5000, () => console.log("Server running @ http://localhost:5000"));