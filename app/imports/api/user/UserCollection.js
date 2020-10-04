import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { Participants } from './ParticipantCollection';
import { Administrators } from './AdministratorCollection';

const xkpasswd = require('xkpasswd');

const generatePassword = () => xkpasswd();

class UserCollection {
  constructor() {
    this._collectionName = 'UserCollection';
  }

  define({ username, role }) {
    const password = generatePassword();
    console.log(`Defining user ${username} with password ${password}`);
    const userID = Accounts.createUser({ username, email: username, password });
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, [role]);
    return { userID, password };
  }

  /**
   * Returns the userID associated with user, or throws an error if not defined.
   * @param user The user (username or userID).
   * @returns { String } The userID
   * @throws { Meteor.Error } If user is not a defined username or userID.
   */
  getID(user) {
    const userDoc = (Meteor.users.findOne({ _id: user })) || (Meteor.users.findOne({ username: user }));
    if (!userDoc) {
      console.error('Error: user is not defined: ', user);
      // console.trace(`Error: user is not defined: ${user}`);
      throw new Meteor.Error(`Error: user ${user} is not defined.`);
    }
    return userDoc._id;
  }

  /**
   * Returns the profile document associated with user, or null if not found.
   * Assumes that the user is defined. If not, throws an error.
   * @param user The username or userID.
   * @returns { Object | Null } The profile document or null if not found.
   */
  hasProfile(user) {
    const userID = this.getID(user);
    return Participants.hasProfile(userID) || Administrators.hasProfile(userID);
  }

  getProfile(user) {
    // First, let's check to see if user is actually a profile (or looks like one). If so, just return it.
    if (_.isObject(user) && _.has(user, 'firstName') && _.has(user, 'lastName') && _.has(user, 'role')) {
      return user;
    }
    const profile = this.hasProfile(user);
    if (!profile) {
      console.log(`No profile found for user ${user}`);
      throw new Meteor.Error(`No profile found for user ${user}`);
    }
    return profile;

  }
}

/**
 * Singleton instance of the UserCollection.
 * @type {UserCollection}
 * @memberOf api/user
 */
export const Users = new UserCollection();
