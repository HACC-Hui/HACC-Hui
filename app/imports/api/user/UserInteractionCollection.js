import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

/**
 * UserInteractionCollection, colletion of user interactions with HACC-Hui application.
 * @extends api/base.BaseCollection
 * @memberOf api/user
 */
class UserInteractionCollection extends BaseCollection {
  constructor() {
    super('UserInteraction', new SimpleSchema({
      username: { type: String },
      type: { type: String },
      typeData: { type: Array },
      'typeData.$': { type: String },
      timestamp: { type: Date },
    }));
  }

  /**
   * Defines a user interaction.
   * @param username {String} the user.
   * @param type {String} the type of interaction.
   * @param typeData {String[]} additional information about the interaction.
   * @param timestamp {Date} the time of the interaction.
   * @return {String} the ID of the user interaction.
   */
  define({ username, type, typeData, timestamp = moment().toDate() }) {
    const doc = this._collection.findOne({ username, type, typeData, timestamp });
    if (doc) {
      return doc._id;
    }
    return this._collection.insert({ username, type, typeData, timestamp });
  }

  /**
   * Removes all interactions for the given username.
   * @param username {String} the user's name to remove.
   */
  removeUser(username) {
    this._collection.remove({ username });
  }

  dumpOne(docID) {
    this.assertDefined(docID);
    const { username, type, typeData, timestamp } = this.findDoc(docID);
    return { username, type, typeData, timestamp };
  }

  /**
   * Asserts that the userID belongs to an admin role when running the find and removeUser method
   * within this class.
   * @param userId {String} The userId of the logged in user.
   */
  assertAdminRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN]);
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.PARTICIPANT]);
  }

}

/**
 * Singleton instance of the UserInteractionCollection.
 * @type {api/user.UserInteractionCollection}
 * @memberOf api/user
 */
export const UserInteractions = new UserInteractionCollection();
