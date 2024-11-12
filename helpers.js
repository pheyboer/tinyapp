//Helper function to get user by email - refactor to include users database
//Using for...in to directly loop through users object
const getUserByEmail = (email, database) => {
  for (let userId in database) {
    if (database[userId].email === email) {
      return database[userId];
    }
  }
  return false; //if no matching email found, return false
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
const urlsForUser = (userId, urlDatabase) => {
  const userUrls = {};
  for (let urlId in urlDatabase) {
    if (urlDatabase[urlId].userID === userId) { //check if userID matches
      userUrls[urlId] = urlDatabase[urlId];
    }
  }
  return userUrls;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
};