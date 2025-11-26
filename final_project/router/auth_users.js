const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ "username": "rishi kumar", "password": "secret123" }];
let existingSessions = [{ "username": "rishi kumar", "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJpc2hpIGt1bWFyIiwiaWF0IjoxNzY0MTYyNDg4LCJleHAiOjE3NjQxNjYwODh9.1ZOu2_9lXIb0nzJLMcCGwQtJmq-jvBJ8X7ARnF7kPP4" }]

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    if (username?.trim()?.length >= 6) {
        return true
    } else {
        false
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    if (Object.values(users).find((user) => user.username === username && user.password === password)) {
        return true
    } else {
        false
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const { username, password } = req.body
    if (authenticatedUser(username, password)) {
        const payload = { username }; // data you want inside token

        const token = jwt.sign(payload, "rishi_key", {
            expiresIn: "1h", // token valid for 1 hour
        });
        req.session.authorization = {
            token, username
        }
        res.json({ message: `${username} logged in successfully with token :`, token });
    } else {
        return res.status(500).json({ message: "Invalid credentials" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    jwt.verify(authHeader, "rishi_key", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        req.user = decoded;
    });

    const { isbn } = req.params
    const { review } = req.query
    const user = req.user
    if (review) {
        let currentBookReviews = books.filter((book) => book.isbn == isbn)[0].reviews
        if (currentBookReviews[user]) {
            currentBookReviews[user].push(review)
        } else {
            currentBookReviews[user] = [review]
        }
        return res.status(200).json({ message: `review updated successfully with user ${user}` });
    } else {
        return res.status(500).json({ message: "review not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
