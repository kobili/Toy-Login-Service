"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const UserRoute_1 = require("./UserRoute");
const app = express_1.default();
// connect to database
db_1.connectDB();
// use routes for user endpoints
app.use("/api/v1/user", UserRoute_1.router);
// start the server
app.listen(5000, () => console.log("Server running @ http://localhost:5000"));
