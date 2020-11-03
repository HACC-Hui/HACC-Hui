import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';
import { Roles } from 'meteor/alanning:roles';
import { HACCHui } from '../hacc-hui/HACCHui';
import { ROLE } from '../role/Role';
import { Teams } from '../team/TeamCollection';
import { TeamChallenges } from '../team/TeamChallengeCollection';
import { Challenges } from '../challenge/ChallengeCollection';
import { TeamParticipants } from '../team/TeamParticipantCollection';
import { Participants } from '../user/ParticipantCollection';
import { MinorParticipants } from '../user/MinorParticipantCollection';

/**
 * Allows admins to create and return a JSON object to the client representing a snapshot of the HACC-Hui database.
 * @memberOf api/base
 * @type {ValidatedMethod}
 */
export const dumpDatabaseMethod = new ValidatedMethod({
  name: 'base.dumpDatabase',
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to dump the database..');
    }
    if (!Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
      throw new Meteor.Error('unauthorized', 'You must be an admin to dump the database.');
    }
    // Don't do the dump except on server side (disable client-side simulation).
    // Return an object with fields timestamp and collections.
    if (Meteor.isServer) {
      const collections = _.sortBy(HACCHui.collectionLoadSequence.map((collection) => collection.dumpAll()),
          (entry) => entry.name);
      const timestamp = new Date();
      return { timestamp, collections };
    }
    return null;
  },
});

/**
 * Allows admins to create a tab separated list of the teams, their challenge(s), members, and captain.
 * @memberOf api/base
 * @type {ValidatedMethod}
 */
export const dumpTeamCSVMethod = new ValidatedMethod({
  name: 'base.dumpTeamCSV',
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to dump the teams.');
    }
    if (!Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
      throw new Meteor.Error('unauthorized', 'You must be an admin to dump the teams.');
    }
    if (Meteor.isServer) {
      let result = '';
      const headerArr = ['Team Name', 'Challenge(s)', 'Members', 'Captain', 'Captain Email', 'Affiliation'];
      result += headerArr.join('\t');
      result += '\r\n';
      const teams = Teams.find({}).fetch();
      _.forEach(teams, (team) => {
        const teamID = team._id;
        const row = [team.name];
        const tcs = TeamChallenges.find({ teamID }).fetch();
        const challenges = tcs.map((tc) => Challenges.findDoc(tc.challengeID).title);
        row.push(challenges.join(', '));
        const tps = TeamParticipants.find({ teamID }).fetch();
        const members = tps.map((tp) => {
          const fullName = Participants.getFullName(tp.participantID);
          const minor = MinorParticipants.find({ participantID: tp.participantID }).fetch().length > 0 ? 'M' : 'A';
          return `${fullName} ${minor}`;
        });
        row.push(members.join(', '));
        const captain = Participants.getFullName(team.owner);
        const captainMinor = MinorParticipants.find({ participantID: team.owner }).fetch().length > 0 ? 'M' : 'A';
        row.push(`${captain} ${captainMinor}`);
        row.push(Participants.findDoc(team.owner).username);
        row.push(`${team.affiliation}`);
        result += row.join('\t');
        result += '\r\n';
      });
      // add the participants not on a team.
      result += '\r\n';
      result += '\r\n';
      const allParticipants = Participants.find({}).fetch();
      const teamParticipants = TeamParticipants.find({}).fetch();
      const teamParticipantIDs = _.uniq(_.map(teamParticipants, (tp) => tp.participantID));
      const notOnTeams = _.filter(allParticipants, (p) => !_.includes(teamParticipantIDs, p._id));
      const notOnTeamsNames = _.map(notOnTeams, (p) => Participants.getFullName(p._id));
      result += `Participants Not On a Team (${notOnTeams.length})\r\n`;
      _.forEach(notOnTeamsNames, (name) => {
        result += `${name}\r\n`;
      });
      const timestamp = new Date();
      return { timestamp, result };
    }
    return '';
  },
});

/**
 * Meteor method used to define new instances of the given collection name.
 * @param collectionName the name of the collection.
 * @param definitionDate the object used in the collection.define method.
 * @memberOf api/base
 * @type {ValidatedMethod}
 */
export const defineMethod = new ValidatedMethod({
  name: 'BaseCollection.define',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ collectionName, definitionData }) {
    // console.log(collectionName, this.userId, definitionData);
    const collection = HACCHui.getCollection(collectionName);
    collection.assertValidRoleForMethod(this.userId);
    return collection.define(definitionData);
  },
});

/**
 * Meteor method used to update a document in the given collection.
 * @param collectionName the name of the collection to update.
 * @param updateData an object containing the document ID and the update data.
 * @type {ValidatedMethod}
 * @memberOf api/base
 */
export const updateMethod = new ValidatedMethod({
  name: 'BaseCollection.update',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ collectionName, updateData }) {
    // console.log('updateMethod(%o, %o)', collectionName, updateData);
    const collection = HACCHui.getCollection(collectionName);
    collection.assertValidRoleForMethod(this.userId);
    collection.update(updateData.id, updateData);
    return true;
  },
});

/**
 * Meteor method used to remove a document from a collection.
 * @param collectionName the name of the collection.
 * @param instance the document ID to remove.
 * @memberOf api/base
 * @type {ValidatedMethod}
 */
export const removeItMethod = new ValidatedMethod({
  name: 'BaseCollection.removeIt',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ collectionName, instance }) {
    const collection = HACCHui.getCollection(collectionName);
    collection.assertValidRoleForMethod(this.userId);
    collection.removeIt(instance);
    return true;
  },
});
