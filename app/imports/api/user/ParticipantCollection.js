import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { demographicLevels } from '../level/Levels';
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';
import { Users } from './UserCollection';
import { ParticipantChallenges } from './ParticipantChallengeCollection';
import { ParticipantInterests } from './ParticipantInterestCollection';
import { ParticipantSkills } from './ParticipantSkillCollection';
import { ParticipantTools } from './ParticipantToolCollection';
import { Challenges } from '../challenge/ChallengeCollection';
import { Interests } from '../interest/InterestCollection';
import { Skills } from '../skill/SkillCollection';
import { Tools } from '../tool/ToolCollection';

/**
 * ParticipantCollection, collection of HACC-Hui participants.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/user
 */
class ParticipantCollection extends BaseSlugCollection {
  constructor() {
    super('Participant', new SimpleSchema({
      username: { type: String },
      slugID: { type: String },
      firstName: { type: String },
      lastName: { type: String },
      demographicLevel: { type: String, allowedValues: demographicLevels, optional: true },
      linkedIn: { type: String, optional: true },
      gitHub: { type: String, optional: true },
      website: { type: String, optional: true },
      aboutMe: { type: String, optional: true },
      userID: { type: SimpleSchema.RegEx.Id, optional: true },
      lookingForTeam: { type: Boolean, optional: true },
      isCompliant: { type: Boolean, optional: true },
    }));
  }

  /**
   * Creates a new participant.
   * @param username {String} the participant's username.
   * @param firstName {String} the participant's first name.
   * @param lastName {String} the participant's last name.
   * @param demographicLevel {String} the participant's demographic level.
   * @param lookingForTeam {Boolean} if the participant is looking for a team.
   * @param challenges {String[]} the challenges the participant is interested in.
   * @param interests {String[]} the participant's interests.
   * @param skills {Object[]} the participant's skills.
   * @param tools {Object[]} the tools the participant is interested in.
   * @param linkedIn {String} the participant's LinkedIn page (optional).
   * @param gitHub {String} the participant's GitHub page (optional).
   * @param website {String} the participant's website (optional).
   * @param aboutMe {String} a short description.
   * @param isCompliant {Boolean} is the participant compliant.
   * @return {{password: *, profileID: any}|undefined}
   */
  define({
           username, firstName, lastName, demographicLevel, lookingForTeam,
           challenges = [], interests = [], skills = [], tools = [],
           linkedIn = '', gitHub = '', website = '', aboutMe = '',
           isCompliant = false,
         }) {
    if (Meteor.isServer) {
      const role = ROLE.PARTICIPANT;
      const slugID = Slugs.define({ name: username }); // ensure the usernames are unique
      const profileID = this._collection.insert({
        username, slugID, firstName, lastName, demographicLevel,
        lookingForTeam, linkedIn, gitHub, website, aboutMe, isCompliant,
      });
      Slugs.updateEntityID(slugID, profileID);
      const { userID, password } = Users.define({ username, role });
      this._collection.update(profileID, { $set: { userID } });
      _.forEach(challenges, (challenge) => ParticipantChallenges.define({ challenge, participant: username }));
      _.forEach(interests, (interest) => ParticipantInterests.define({ interest, participant: username }));
      _.forEach(skills, (skill) => {
        ParticipantSkills.define({ skill, participant: username });
      });
      _.forEach(tools, (tool) => {
        ParticipantTools.define({ tool, participant: username });
      });
      return { profileID, password };
    }
    return undefined;
  }

  /**
   * Updates the participant.
   * @param docID {String} the ID of the participant to update.
   * @param firstName {String} the new first name (optional).
   * @param lastName {String} the new last name (optional).
   * @param demographicLevel {String} the new demographic level (optional).
   * @param lookingForTeam {Boolean} the new looking for team value (optional).
   * @param challenges {String[]} the new challenges (optional).
   * @param interests {String[]} the new interests (optional).
   * @param skills {String[]} the new skills (optional).
   * @param tools {String[]} the new tools (optional).
   * @param linkedIn {String} the new LinkedIn page (optional).
   * @param gitHub {String} the new GitHub page (optional).
   * @param website {String} the new website (optional).
   * @param aboutMe {String} the new short description (optional).
   * @param isCompliant {Boolean} the new is compliant value (optional).
   */
  update(docID, {
    firstName, lastName, demographicLevel, lookingForTeam, challenges,
    interests, skills, tools, linkedIn, gitHub, website,
    aboutMe, isCompliant,
  }) {
    // console.log('Participants.update', skills, tools);
    this.assertDefined(docID);
    const updateData = {};
    if (firstName) {
      updateData.firstName = firstName;
    }
    if (lastName) {
      updateData.lastName = lastName;
    }
    if (demographicLevel) {
      updateData.demographicLevel = demographicLevel;
    }
    if (_.isBoolean(lookingForTeam)) {
      updateData.lookingForTeam = lookingForTeam;
    }
    if (linkedIn) {
      updateData.linkedIn = linkedIn;
    }
    if (gitHub) {
      updateData.gitHub = gitHub;
    }
    if (website) {
      updateData.website = website;
    }
    if (aboutMe) {
      updateData.aboutMe = aboutMe;
    }
    if (_.isBoolean(isCompliant)) {
      updateData.isCompliant = isCompliant;
    }
    this._collection.update(docID, { $set: updateData });
    const participant = this.findSlugByID(docID);
    if (challenges) {
      ParticipantChallenges.removeParticipant(participant);
      _.forEach(challenges, (challenge) => ParticipantChallenges.define({ challenge, participant }));
    }
    if (interests) {
      ParticipantInterests.removeParticipant(participant);
      _.forEach(interests, (interest) => ParticipantInterests.define({ interest, participant }));
    }
    if (skills) {
      ParticipantSkills.removeParticipant(participant);
      _.forEach(skills, (skill) => {
        ParticipantSkills.define({ skill, participant });
      });
    }
    if (tools) {
      ParticipantTools.removeParticipant(participant);
      _.forEach(tools, (tool) => {
        ParticipantTools.define({ tool, participant });
      });
    }
  }

  /**
   * Removes the participant.
   * @param docID {String} the ID of the participant.
   * @throws {Meteor.Error} if the docID is not defined.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    const participant = this.findSlugByID(docID);
    ParticipantChallenges.removeParticipant(participant);
    ParticipantInterests.removeParticipant(participant);
    ParticipantSkills.removeParticipant(participant);
    ParticipantTools.removeParticipant(participant);
    super.removeIt(docID);
  }

  /**
   * Returns an object representing the participant.
   * @param docID {String} the ID of the participant.
   * @return {{lastName: *, website: *, gitHub: *, challenges: Array, demographicLevel: *,
   * lookingForTeam: *, linkedIn: *, tools: Array, isCompliant: *, aboutMe: *, skills: Array,
   * firstName: *, interests: Array, username: *}}
   */
  dumpOne(docID) {
    this.assertDefined(docID);
    const {
      _id, username, firstName, lastName, demographicLevel, lookingForTeam,
      linkedIn, gitHub, website, aboutMe, isCompliant,
    } = this.findDoc(docID);
    const selector = { participantID: _id };
    const devChallenges = ParticipantChallenges.find(selector).fetch();
    const challenges = _.map(devChallenges, (dC) => Challenges.findSlugByID(dC.challengeID));
    const devInterests = ParticipantInterests.find(selector).fetch();
    const interests = _.map(devInterests, (dI) => Interests.findSlugByID(dI.interestID));
    const devSkills = ParticipantSkills.find(selector).fetch();
    const skills = _.map(devSkills, (dS) => {
      const skill = Skills.findSlugByID(dS.skillID);
      const skillLevel = dS.skillLevel;
      return {
        skill,
        skillLevel,
      };
    });
    const devTools = ParticipantTools.find(selector).fetch();
    const tools = _.map(devTools, (dT) => {
      const tool = Tools.findSlugByID(dT.toolID);
      const toolLevel = dT.toolLevel;
      return {
        tool,
        toolLevel,
      };
    });
    // console.log('Participants.dumpOne', docID, skills, tools);
    return {
      username, firstName, lastName, demographicLevel, lookingForTeam, isCompliant,
      linkedIn, gitHub, website, aboutMe, challenges, interests, skills, tools,
    };
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
    this.assertRole(userId, [ROLE.ADMIN, ROLE.PARTICIPANT]);
  }

  /**
   * Returns true if the passed entity is in this collection.
   * @param { String | Object } name The docID, or an object specifying a documennt.
   * @returns {boolean} True if name exists in this collection.
   */
  isDefined(name) {
    // console.log('isDefined', name);
    if (_.isUndefined(name) || _.isNull(name)) {
      return false;
    }
    return (
        !!this._collection.findOne(name)
        || !!this._collection.findOne({ name })
        || !!this._collection.findOne({ _id: name })
        || !!this._collection.findOne({ userID: name }));
  }

  getFullName(docID) {
    this.assertDefined(docID);
    const { firstName, lastName } = this.findDoc(docID);
    return `${firstName} ${lastName}`;
  }
}

/**
 * Singleton instance of the ParticipantCollection.
 * @type {api/user.participantCollection}
 * @memberOf api/user
 */
export const Participants = new ParticipantCollection();
