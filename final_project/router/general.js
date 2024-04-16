const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(400).json({message: "Bad Request: username and/or password are missing!"});
  }

  let registered_users = users.filter((user) => user.username === username);

  if(registered_users.length === 0 ){
    users.push({"username": username, "password": password});
    return res.status(200).json({message: `User: ${username} has been created successfully!`});
  }

  return res.status(400).json({message: "Bad Request: user already exists!"});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(books);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if(!isbn){
    return res.status(400).json({message: "Bad Request: ISBN is missing!"});
  }

  let book = books[isbn];

  if(!book){
    return res.status(404).json({message: "Not Found!"});
  }

  return res.status(200).send(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
  
  if(!author){
    return res.status(400).json({message: "Bad Request: author is missing!"});
  }

  let filtered_books = Object.values(books).filter((book) => book.author === author);

  if(filtered_books.length === 0){
    return res.status(200).json({message: "No books are found for this author"});
  }

  return res.status(200).send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
  
  if(!title){
    return res.status(400).json({message: "Bad Request: title is missing!"});
  }

  let filtered_books = Object.values(books).filter((book) => book.title === title);

  if(filtered_books.length === 0){
    return res.status(200).json({message: "No books are found with this title"});
  }
  
  return res.status(200).send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  
    if(!isbn){
      return res.status(400).json({message: "Bad Request: ISBN is missing!"});
    }
  
    let book = books[isbn];
  
    if(!book){
      return res.status(404).json({message: "Book Not Found!"});
    }
  
    return res.status(200).send(book.reviews);
});




//10
function getBookList() {
  return new Promise((resolve, reject) => resolve(books));
}

// Get the book list available
public_users.get('/', function (req, res) {
  getBookList().then(
    (bk) => res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send("denied")
  );
});

//11
function getFromISBN(isbn) {
  let book_ = books[isbn];
  return new Promise((resolve, reject) => {
    if (book_) {
      resolve(book_);
    } else {
      reject("Unable to find book!");
    }
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn).then(
    (bk) => res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send(error)
  );
});

//12
function getFromAuthor(author) {
  let output = [];
  return new Promise((resolve, reject) => {
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.author === author) {
        output.push(book_);
      }
    }
    resolve(output);
  });
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  getFromAuthor(author).then(
    (result) => res.send(JSON.stringify(result, null, 4))
  );
});

//13
function getFromTitle(title) {
  let output = [];
  return new Promise((resolve, reject) => {
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.title === title) {
        output.push(book_);
      }
    }
    resolve(output);
  });
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  getFromTitle(title).then(
    (result) => res.send(JSON.stringify(result, null, 4))
  );
});


module.exports.general = public_users;
