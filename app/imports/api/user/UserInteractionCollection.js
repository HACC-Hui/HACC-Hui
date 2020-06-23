import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

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

  define({ username, type, typeData, timestamp = moment().toDate() }) {
    const doc = this._collection.findOne({ username, type, typeData, timestamp });
    if (doc) {
      return doc._id;
    }
    return this._collection.insert({ username, type, typeData, timestamp });
  }

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
   * @param userId The userId of the logged in user.
   */
  assertAdminRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN]);
  }


  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.DEVELOPER]);
  }

}

export const UserInteractions = new UserInteractionCollection();
