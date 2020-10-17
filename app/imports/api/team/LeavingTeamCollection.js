import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseCollection from '../base/BaseCollection';
import { Participants } from '../user/ParticipantCollection';
import { Teams } from './TeamCollection';
import { ROLE } from '../role/Role';

class LeavingTeamCollection extends BaseCollection {
  constructor() {
    super('LeavingTeam', new SimpleSchema({
      participantID: { type: SimpleSchema.RegEx.Id },
      teamID: { type: SimpleSchema.RegEx.Id },
      sentOwnerDM: { type: Boolean },
    }));
  }

  /**
   * Defines a leaving team record.
   * @param username {String} the username who is leaving the team.
   * @param team {String} the team slug or ID.
   */
  define({ username, team }) {
    const participantID = Participants.getID(username);
    const teamID = Teams.getID(team);
    return this._collection.insert({ participantID, teamID, sentOwnerDM: false });
  }

  /**
   * Updates the record.
   * @param docID {String} the ID of the record to update.
   * @param sentOwnerDM {Boolean} the new value for sentAdminDM.
   */
  update(docID, { sentOwnerDM }) {
    this.assertDefined(docID);
    const updateData = {};
    if (_.isBoolean(sentOwnerDM)) {
      updateData.sentOwnerDM = sentOwnerDM;
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

export const LeavingTeams = new LeavingTeamCollection();
