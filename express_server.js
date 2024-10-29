const express = require("express"); //Import Express module
const app = express(); //Create an Express Application
const PORT = 8080; // default port 8080

// Set ESJ as the view engine
app.set("view engine", "ejs");

// Sample URL
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Define route to present the form to the user
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Define a route for handling GET requests to a specific URL from id 
app.get("/urls/:id", (req, res) => {
  const id = req.params.id; // Defined id
  const longURL = urlDatabase[id]; // Lookup longURL by id
  const templateVars = { id: id, longURL: longURL }; // Create templateVars object
  res.render("urls_show", templateVars);
});

// Start server and listen on specified port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`); // Log message when server starts
});