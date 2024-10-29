const express = require("express"); //Import Express module
const app = express(); //Create an Express Application
const PORT = 8080; // default port 8080

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

// Start server and listen on specified port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`); // Log message when server starts
});