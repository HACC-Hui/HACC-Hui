import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

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
}

export const Users = new UserCollection();
