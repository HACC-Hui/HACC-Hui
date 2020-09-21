import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';
import { Users } from './UserCollection';

/** @namespace api/user */

/**
 * AdministratorCollection, collection of the HACC-Hui administrators.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/user
 */
class AdministratorCollection extends BaseSlugCollection {
  constructor() {
    super('Administrator', new SimpleSchema({
      username: { type: String },
      slugID: { type: String },
      firstName: { type: String },
      lastName: { type: String },
      userID: { type: SimpleSchema.RegEx.Id, optional: true },
    }));
  }

  /**
   * Defines a new administrator.
   * @param username {String} the administrator's username.
   * @param firstName {String} the administrator's first name.
   * @param lastName {String} the administrator's last name.
   * @return {{password: *, profileID: any}|undefined}
   */
  define({ username, firstName, lastName }) {
    if (Meteor.isServer) {
      const role = ROLE.ADMIN;
      const slugID = Slugs.define({ name: username }); // ensure the usernames are unique
      const profileID = this._collection.insert({ username, slugID, firstName, lastName });
      Slugs.updateEntityID(slugID, profileID);
      const { userID, password } = Users.define({ username, role });
      this._collection.update(profileID, { $set: { userID } });
      return { profileID, password };
    }
    return undefined;
  }

  /**
   * Updates the administrator's information.
   * @param docID {String} the ID to update.
   * @param firstName {String} the new first name (optional).
   * @param lastName {String} the new last name (optional).
   */
  update(docID, { firstName, lastName }) {
    this.assertDefined(docID);
    const updateData = {};
    if (firstName) {
      updateData.firstName = firstName;
    }
    if (lastName) {
      updateData.lastName = lastName;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Removes the give administrator.
   * @param docID {String} the ID.
   */
  removeIt(docID) {
    super.removeIt(docID);
  }

  /**
   * Returns an object representing the administrator.
   * @param docID {String} the ID.
   * @return {{firstName: *, lastName: *, username: *}}
   */
  dumpOne(docID) {
    this.assertDefined(docID);
    const { username, firstName, lastName } = this.findDoc(docID);
    return { username, firstName, lastName };
  }

  /**
   * Returns non-null if the user has a profile in this collection.
   * @param user The user (either their username (email) or their userID).
   * @return The profile document if the profile exists, or null if not found.
   * @throws { Meteor.Error } If user is not a valid user.
   */
  hasProfile(user) {
    const userID = Users.getID(user);
    return this._collection.findOne({ userID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN]);
  }

}

/**
 * Singleton instance of the AdministratorCollection.
 * @type {api/user.AdministratorCollection}
 * @memberOf api/user
 */
export const Administrators = new AdministratorCollection();
