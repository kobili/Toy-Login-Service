"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDB = exports.connectDB = exports.userFilePath = exports.dataPath = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let dataPath = path_1.default.join(__dirname, "..", "data");
exports.dataPath = dataPath;
let userFilePath = path_1.default.join(dataPath, "users.json");
exports.userFilePath = userFilePath;
/**
 * create a json file to house all users' data if one doesn't already exist
 * file will be located at "../data/"
 */
function connectDB() {
    // check if user data already exists
    if (fs_1.default.existsSync(userFilePath)) {
        console.log("Reading existing User Database");
        return;
    }
    else {
        // create an empty user database
        let users = [];
        if (!fs_1.default.existsSync(dataPath)) {
            fs_1.default.mkdirSync(dataPath);
        }
        fs_1.default.writeFileSync(userFilePath, JSON.stringify(users));
        console.log("User database generated!");
    }
}
exports.connectDB = connectDB;
/**
 * reads the JSON object stored in the json file housing user data
 */
function readDB() {
    let users = JSON.parse(fs_1.default.readFileSync(userFilePath, "utf-8"));
    return users;
}
exports.readDB = readDB;
