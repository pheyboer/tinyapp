const express = require("express"); //Import Express module
const cookieParser = require("cookie-parser");
const app = express(); //Create an Express Application
const PORT = 8080; // default port 8080

// Set ESJ as the view engine
app.set("view engine", "ejs");

// Cookie Parser Middleware
app.use(cookieParser());

// Middleware to parse URL encoded Data
app.use(express.urlencoded({ extended: true }));

// Middleware to pass the user object to the _header
app.use((req, res, next) => {
  const userId = req.cookies["userId"];
  if (userId && users[userId]) {
    res.locals.user = users[userId];
  }
  next();
});

// Sample URL
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Setting up global users Object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "[email protected]",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "[email protected]",
    password: "dishwasher-funk",
  },
};

// Function to generate a random short URL ID
const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};


// Helper function to check if email exists
const emailExists = (users, email) => {
  return Object.keys(users).includes(email);
};

// Route handler for POST requests to the /urls endpoint
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

// Define route that responds to GET requests to "/hello"
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Define route for root URL
app.get("/", (req, res) => {
  res.send("Hello!"); // Send greeting as response
});

// Define route to get the URL database in JSON
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Define a route that listens for GET requests made to /urls endpoint
app.get("/urls", (req, res) => {
  const templateVars = {
    user: res.locals.user || null,
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// Define route for Log in
app.get("/login", (req, res) => {
  res.render("login");
});

// Define endpoint to handle a POST to /login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Please enter Email and Password");
  }

  const user = Object.values(users).find(user => user.email === email);

  if (!user || user.password !== password) {
    return res.status(400).send("Email or Password is Invalid, Please try again");
  }

  res.cookie("userId", user.id); //set cookie
  res.redirect("/urls");
});

// Route to handle Log Out
app.post("/logout", (req, res) => {
  res.clearCookie("userId");
  res.redirect("/urls");
});

// Define route to present the form to the user
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: res.locals.user || null,
    urls: urlDatabase
  };
  res.render("urls_new", templateVars);
});

// Define a route for handling GET requests to a specific URL from id
app.get("/urls/:id", (req, res) => {
  const id = req.params.id; // Get URL from ID
  const longURL = urlDatabase[id]; // Lookup longURL by id
  if (!longURL) {
    return res.status(404).send("URL not found"); // Handle 404 Error
  }
  const templateVars = {
    user: res.locals.user || null,
    id: id,
    longURL: longURL
  }; // Create templateVars object
  res.render("urls_show", templateVars);
});

// Define route for redirect to longURL
app.get("/u/:id", (req, res) => {
  const id = req.params.id; // Get ID from URL
  const longURL = urlDatabase[id]; // Lookup longURL by ID
  if (longURL) {
    res.redirect(longURL); // Redirect if longURL found
  } else {
    res.status(404).send("URL not found"); // Handle 404 Error
  }
});

// Define POST route that removes a URL resource
app.post('/urls/:id/delete', (req, res) => {
  const { id } = req.params;
  if (urlDatabase[id]) {
    delete urlDatabase[id];
    res.redirect('/urls'); // redirect back to urls_index
  } //else {
  //res.status(404).send('URL not found');
  //}
});

// Define route to update the long URL
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newLongUrl = req.body.longURL;

  if (urlDatabase[id]) {
    urlDatabase[id] = newLongUrl;
    res.redirect("/urls");
  }
});

// Define route for GET /register
app.get("/register", (req, res) => {
  const templateVars = {
    user: res.locals.user || null,
  };
  res.render("register", templateVars);
});

// Handle registration logic and handle registration errors
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Please enter valid Email and Password");
  }

  if (emailExists(users, email)) {
    return res.status(400).send("Email is registered already");
  }

  const userID = generateRandomString();
  const newUser = {
    id: userID,
    email: email,
    password: password,
  };
  users[userID] = newUser;
  res.cookie("userId", userID);
  res.redirect("/urls");
});


// Start server and listen on specified port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`); // Log message when server starts
});