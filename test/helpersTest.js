const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

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

describe('getUserByEmail', function() {
  it('should return a user object with the same email as the one provided', function() {
    const user = getUserByEmail("[email protected]", testUsers);
    const expectedUserID = "userRandomID";

    assert.equal(user.email, "[email protected]", "Returned user's email should match the provided email")
    assert.isObject(user, "User should be an Object when given email that is in database");
    assert.equal(user.id, expectedUserID, "User ID has to match expected ID");
  });

  it('should return undefined if email does not exist', function() {
    const user = getUserByEmail("[email protecting]", testUsers);
    assert.isFalse(user, 'User undefined when it does not exist in database');
  });
  
});