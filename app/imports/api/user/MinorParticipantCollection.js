import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseCollection from '../base/BaseCollection';
import { Participants } from './ParticipantCollection';
import { ROLE } from '../role/Role';

class MinorParticipantCollection extends BaseCollection {

  constructor() {
    super('MinorParticipant', new SimpleSchema({
      participantID: { type: SimpleSchema.RegEx.Id },
      parentFirstName: { type: String },
      parentLastName: { type: String },
      parentEmail: { type: String },
      sentAdminDM: { type: Boolean },
    }));
  }

  /**
   * Defines a new minor participant record.
   * @param username {String} the participant's username.
   * @param parentFirstName {String} the participant's parent/guardian's first name.
   * @param parentLastName {String} the participant's parent/guardian's last name.
   * @param parentEmail {String} the participant's parent/guardian's email address.
   */
  define({ username, parentFirstName, parentLastName, parentEmail }) {
    const participantID = Participants.getID(username);
    return this._collection.insert({ participantID, parentFirstName, parentLastName, parentEmail, sentAdminDM: false });
  }

  /**
   * Updates the record.
   * @param docID {String} the ID of the record to update.
   * @param sentAdminDM {Boolean} the new value for sentAdminDM.
   */
  update(docID, { sentAdminDM }) {
    this.assertDefined(docID);
    const updateData = {};
    if (_.isBoolean(sentAdminDM)) {
      updateData.sentAdminDM = sentAdminDM;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Removes the record.
   * @param docID {String} the ID to remove.
   */
  removeIt(docID) {
    super.removeIt(docID);
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.PARTICIPANT]);
  }
}

export const MinorParticipants = new MinorParticipantCollection();
