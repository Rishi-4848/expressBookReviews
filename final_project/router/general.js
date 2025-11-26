const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const { username, password } = req.body
    if (isValid(username)) {
        users.push({ username, password })
        return res.status(200).json({ message: `${username} registered successfully` });
    } else {
        return res.status(300).json({ message: "Invalid username" });
    }

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.status(200).json(JSON.stringify(books, null, 0));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const { isbn } = req.params
    if (isbn) {
        const filteredBooks = Object.values(books).filter((book) => book.isbn == isbn)
        return res.status(200).json(JSON.stringify(filteredBooks, null, 0));
    } else {
        return res.status(500).json({ message: "Invalid isbn code" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params
    if (author) {
        const filteredBooks = Object.values(books).filter((book) => book.author == author)
        return res.status(200).json(JSON.stringify(filteredBooks, null, 0));
    } else {
        return res.status(500).json({ message: "Invalid author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params
    if (title) {
        const filteredBooks = Object.values(books).filter((book) => book.title == title)
        return res.status(200).json(JSON.stringify(filteredBooks, null, 0));
    } else {
        return res.status(500).json({ message: "Invalid title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params
    if (isbn) {
        const filteredBooks = Object.values(books).filter((book) => book.isbn == isbn).map((book) => book.reviews)
        return res.status(200).json(JSON.stringify(filteredBooks, null, 0));
    } else {
        return res.status(500).json({ message: "Invalid isbn code" });
    }
});

module.exports.general = public_users;
