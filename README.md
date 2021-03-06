﻿# Toy Login Service

wip

A login api written as a personal learning project

POST /api/v1/user/register
    - Registers a user
    - Request body should contain an email and a password
        {
            "email": "example@example.com",
            "password": "examplePassword"
        }
    - Password is hashed using bcrypt
    - generates a user id using uuidv4
    - On success, a response with status code 200 is returned along with a json document containing the email and id of the user
        {
            "email": "example@example.com",
            "id": "some uuid string"
        }
    - If there is already a registered user with the input email address, a response with status code 409 is sent


POST /api/v1/user/login
    - Logs a user in
    - Request body should contain an email and a password
        {
            "email": "example@example.com",
            "password": "examplePassword"
        }
    - Email and password are compared to the database entry for the user associated with the email
    - On successful sign in, signs a JWT token with the user's id as a payload
        - sends a response with status code 200 and a json document with the JWT token
        {
            "message": "Authentication successful",
            "token": "some JWT token"
        }
    - If a user with the given email doesn't exist, sends a response with status 404
    - If the password is incorrect, sends a response with status 401

GET /api/v1/user/me
    - Gets the email and id of the currently signed in user
    - Request header should contain the JWT token associated with the currently signed in user under a field called 'x-access-token'
    - If the token is valid, a response is sent with status 200 and a json document containing the user's email and id
        {
            "email": "example@example.com",
            "id": "some uuid string"
        }
    - If the token is missing, invalid or expired a response with status 401 is sent
