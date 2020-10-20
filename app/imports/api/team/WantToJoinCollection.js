import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseCollection from '../base/BaseCollection';
import { Participants } from '../user/ParticipantCollection';
import { Teams } from './TeamCollection';
import { ROLE } from '../role/Role';

class WantToJoinCollection extends BaseCollection {

  constructor() {
    super('WantToJoin', new SimpleSchema({
      teamID: { type: SimpleSchema.RegEx.Id },
      participantID: { type: SimpleSchema.RegEx.Id },
      sentJoin: { type: Boolean },
    }));
  }

  /**
   * Defines a participant - team pair indicating the participant wishes to join the team.
   * @param team {String} team slug or ID.
   * @param participant {String} participant slug or ID.
   * @return {String} the ID of the pair.
   */
  // eslint-disable-next-line no-unused-vars
  define({ team, participant }) {
    const teamID = Teams.getID(team);
    const participantID = Participants.getID(participant);
    return this._collection.insert({ teamID, participantID, sentJoin: false });
  }

  /**
   * Updates the given team-participant pair.
   * @param docID {String} the ID of the pair to update.
   * @param team {String} the slug or ID of the team (optional).
   * @param participant {String} the slug or ID of the participant (optional).
   * @param sentJoin {boolean} the new value for sentJoin.
   * @throws {Meteor.Error} if docID is undefined.
   */
  update(docID, { team, participant, sentJoin }) {
    this.assertDefined(docID);
    const updateData = {};
    if (participant) {
      updateData.participantID = Participants.getID(participant);
    }
    if (team) {
      updateData.teamID = Teams.getID(team);
    }
    if (_.isBoolean(sentJoin)) {
      updateData.sentJoin = sentJoin;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Removes the participant-team pair.
   * @param docID {String} the ID to remove.
   */
  removeIt(docID) {
    super.removeIt(docID);
  }

  /**
   * Removes all the pairs with the given participant.
   * @param participant {String} the slug or ID of the participant.
   * @throws {Meteor.Error} if the participant is undefined.
   */
  removeParticipant(participant) {
    const participantID = Participants.getID(participant);
    this._collection.remove({ participantID });
  }

  /**
   * Removes all the pairs with the given team.
   * @param team {String} the slug or ID for the team.
   * @throws {Meteor.Error} if the team is undefined.
   */
  removeTeam(team) {
    const teamID = Teams.getID(team);
    this._collection.remove({ teamID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.PARTICIPANT]);
  }

}

export const WantsToJoin = new WantToJoinCollection();
