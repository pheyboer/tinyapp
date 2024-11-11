//Helper function to get user by email - refactor to include users database
//Using for...in to directly loop through users object
const getUserByEmail = (email, database) => {
  for (let userId in database) {
    if (database[userId].email === email) {
      return database[userId];
    }
  }
  return undefined; //if no matching email found, return undefined
};

module.exports = {
  getUserByEmail,
};