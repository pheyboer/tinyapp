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
    res.locals.user = users[userId]; // Set user data if in object
  } else {
    res.locals.user = null; // if there is no userId, set user to null
  }
  next();
});

// Sample URL
const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  },
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

// Helper function to return URLs where userID is equal to the id of logged in user
const urlsForUser = (id) => {
  const userUrls = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) { //check if userID matches
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

// Helper function to check if email exists
const emailExists = (users, email) => {
  return Object.keys(users).includes(email);
};

//Helper function to find user by email
const getUserByEmail = (email) => {
  return Object.values(users).find(user => user.email === email);
};

// Route handler for POST requests to the /urls endpoint
// Redirect if not logged in
app.post("/urls", (req, res) => {
  const userId = req.cookies["userId"];
  //redirect if not logged in
  if (!userId || !users[userId]) {
    return res.status(403).send("<h2>You must be Registered and Logged in to create a short URL. Please Log in</h2>");
  }
  //console.log(req.body); // Log the POST request body to the console
  //If logged in, create random URL with helper function
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: userId
  };
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
// Modifying to show only logged in users URLs
app.get("/urls", (req, res) => {
  const userId = req.cookies["userId"];
  //No user logged in
  if (!userId || !users[userId]) {
    return res.status(403).send("<h2>Please Log in to view your URLs</h2>");
  }
  //helper function
  const userUrls = urlsForUser(userId);
  // No URLs found
  if (Object.keys(userUrls).length === 0) {
    return res.send("<h2>No URL found! Please create one</h2>");
  }

  const templateVars = {
    user: res.locals.user || null,
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// Define route for Log in
//If user is logged in redirect to /urls
app.get("/login", (req, res) => {
  const userId = req.cookies["userId"];
  if (userId && users[userId]) {
    return res.redirect("/urls");
  }
  res.render("login");
});

// Define endpoint to handle a POST to /login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  //Check if email and password are given
  if (!email || !password) {
    return res.status(400).send("<h2>Please enter Email and Password</h2>");
  }

  //Find user with helper function
  const user = getUserByEmail(email);

  if (!user) {
    return res.status(403).send("<h2>Email not found. Check Email or Register</h2>");
  }

  if (user.password !== password) {
    return res.status(403).send("<h2>Password is Incorrect. Try again</h2>");
  }

  res.cookie("userId", user.id); //set cookie and renamed to userId (eslint wanted cC)
  res.redirect("/urls");
});

// Route to handle Log Out
app.post("/logout", (req, res) => {
  res.clearCookie("userId");
  res.redirect("/login"); //Redirect to /login after logout
});

// Define route to present the form to the user and redirect if not logged in
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["userId"];
  if (!userId || !users[userId]) {
    return res.redirect("/login"); // redirect to login if not logged in
  }
  const templateVars = {
    user: res.locals.user || null,
    urls: urlDatabase
  };
  res.render("urls_new", templateVars);
});

// Define a route for handling GET requests to a specific URL from id
// Restrict access to users own URLs
app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["userId"];
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  //if user isnt logged in, show error message
  if (!userId || !users[userId]) {
    return res.status(403).send("<h2>Please Log in to see URL</h2>");
  }
  //if URL doesnt exist show 404 error message
  if (!longURL) {
    return res.status(404).send("<h2>URL not found. Could be deleted or Does Not Exist</h2>");
  }
  // if URL is not from user show error message
  if (longURL.userID !== userId) {
    return res.status(403).send("<h2>You do not have permission to see URL");
  }
  const templateVars = {
    user: res.locals.user || null,
    id: shortURL,
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
    //if URL not found 404 message sent
    res.status(404).send("<h2>404 - URL not found in database. Please check and try again</h2>"); // Handle 404 Error
  }
});

// Define POST route that removes a URL resource (delete)
app.post('/urls/:id/delete', (req, res) => {
  const userId = req.cookies["userId"];
  const shortURL = req.params.id;
  const url = urlDatabase[shortURL];
  
  if (!userId || !users[userId]) {
    return res.status(403).send("<h2>Please log in to delete URL</h2>");
  }

  if (!url) {
    return res.status(403).send("<h2>404 - URL not found</h2>");
  }

  if (url.userID !== userId) {
    return res.status(403).send("<h2>You don't have permission to delete this URL</h2>");
  }
  delete urlDatabase[shortURL];
  res.redirect('/urls'); // redirect back to urls_index
});

// Define route to update the long URL
app.post("/urls/:id", (req, res) => {
  const userId = req.cookies["userId"];
  const shortURL = req.params.id;
  const newLongUrl = req.body.longURL;
  const url = urlDatabase[shortURL];

  if (!userId || !users[userId]) {
    return res.status(403).send("<h2>Please log in to edit URL</h2>");
  }

  if (!url) {
    return res.status(403).send("<h2>404 - URL not found</h2>");
  }

  if (url.userID !== userId) {
    return res.status(403).send("<h2>You don't have permission to edit this URL</h2>");
  }
  // Update long URL if user is the owner
  url.longURL = newLongUrl;
  res.redirect("/urls");
});

// Define route for GET /register
app.get("/register", (req, res) => {
  const userId = req.cookies["userId"];
  if (userId && users[userId]) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: res.locals.user || null,
  };
  res.render("register", templateVars);
});

// Handle registration logic and handle registration errors
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Check if email and password are given
  if (!email || !password) {
    return res.status(400).send("<h2>Please enter valid Email and Password</h2>");
  }

  //Check for existing user email
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return res.status(400).send("<h2>Email is registered already. Please Log in</h2>");
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