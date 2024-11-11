const { assert } = require('chai');

const { getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "[email protected]",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "[email protected]",
    password: "dishwasher-funk"
  }
};

//Test cases for getUserByEmail function
describe('getUserByEmail', function() {
  it('should return a user object with the same email as the one provided', function() {
    const user = getUserByEmail("[email protected]", testUsers);
    const expectedUserID = "userRandomID";

    assert.equal(user.email, "[email protected]", "Returned user's email should match the provided email");
    assert.isObject(user, "User should be an Object when given email that is in database");
    assert.equal(user.id, expectedUserID, "User ID has to match expected ID");
  });

  it('should return undefined if email does not exist', function() {
    const user = getUserByEmail("[email protecting]", testUsers);
    assert.isFalse(user, 'User undefined when it does not exist in database');
  });
});

//Test Cases for urlsForUser function
describe('urlsForUser', function() {

  const urlDatabase = {
    'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userId: 'user1' },
    '9smE7f': { longURL: 'http://www.google.com', userId: 'user2' },
    'i5qjFc': { longURL: 'http://www.example.com', userId: 'user1' }
  };

  // Test case 1: The function returns only URLs that belong to the specified user
  it('should return only the URLs belonging to the specified user', function() {
    const result = urlsForUser('user1', urlDatabase);
    assert.deepEqual(result, {
      'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userId: 'user1' },
      'i5qjFc': { longURL: 'http://www.example.com', userId: 'user1' }
    });
  });

  // Test case 2: The function returns an empty object if there are no URLs for the specified user
  it('should return an empty object if there are no URLs for the specified user', function() {
    const result = urlsForUser('user3', urlDatabase);
    assert.deepEqual(result, {});
  });

  // Test case 3: The function returns an empty object if the urlDatabase is empty
  it('should return an empty object if the urlDatabase is empty', function() {
    const emptyDatabase = {};
    const result = urlsForUser('user1', emptyDatabase);
    assert.deepEqual(result, {});
  });

  // Test case 4: The function does not return any URLs that do not belong to the specified user
  it('should not return URLs that do not belong to the specified user', function() {
    const result = urlsForUser('user1', urlDatabase);
    assert.notDeepEqual(result, {
      '9smE7f': { longURL: 'http://www.google.com', userId: 'user2' }
    });
  });
});