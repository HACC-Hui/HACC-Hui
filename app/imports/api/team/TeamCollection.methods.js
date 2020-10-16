import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import _ from 'lodash';
import { Teams } from './TeamCollection';
import { Users } from '../user/UserCollection';
import { ROLE } from '../role/Role';
import { WantsToJoin } from './WantToJoinCollection';

/**
 * Meteor method for getting the teams without a GitHub Repository. Only Administrators can run this
 * method.
 * @type {ValidatedMethod}
 * @memberOf api/team
 */
export const getTeamsWithoutGitHubRepoMethod = new ValidatedMethod({
  name: 'TeamsWithoutGitHubRepo.method',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get the teams w/o GitHub repos.');
    } else {
      const profile = Users.getProfile(this.userId);
      if (profile.role !== ROLE.ADMIN) {
        throw new Meteor.Error('unauthorized', 'You must be an admin to get the teams w/o GitHub repos.');
      }
    }
    if (Meteor.isServer) {
      const teams = _.filter(Teams.find().fetch(), (team) => !team.gitHubRepo);
      return teams;
    }
    return null;
  },
});

/**
 * Meteor method for getting the teams without a Devpost page. Only Administrators can run this
 * method.
 * @type {ValidatedMethod}
 * @memberOf api/team
 */
export const getTeamsWithoutDevpostPageMethod = new ValidatedMethod({
  name: 'TeamsWithoutDevpostPage.method',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get the teams w/o Devpost page.');
    } else {
      const profile = Users.getProfile(this.userId);
      if (profile.role !== ROLE.ADMIN) {
        throw new Meteor.Error('unauthorized', 'You must be an admin to get the teams w/o Devpost page.');
      }
    }
    if (Meteor.isServer) {
      const teams = _.filter(Teams.find().fetch(), (team) => !team.devPostPage);
      return teams;
    }
    return null;
  },
});

export const participantIsInterestedInJoiningTeamMethod = new ValidatedMethod({
  name: 'ParticipantInterestedInTeam.method',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ participant, team }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to indicate you are interested in a team.');
    }
    if (Meteor.isServer) {
      WantsToJoin.define({ team, participant });
    }
  },
});
