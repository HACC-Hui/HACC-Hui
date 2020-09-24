import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { demographicLevels } from '../level/Levels';
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';
import { Users } from './UserCollection';
import { DeveloperChallenges } from './DeveloperChallengeCollection';
import { DeveloperInterests } from './DeveloperInterestCollection';
import { DeveloperSkills } from './DeveloperSkillCollection';
import { DeveloperTools } from './DeveloperToolCollection';
import { Challenges } from '../challenge/ChallengeCollection';
import { Interests } from '../interest/InterestCollection';
import { Skills } from '../skill/SkillCollection';
import { Tools } from '../tool/ToolCollection';

/**
 * DeveloperCollection, collection of HACC-Hui developers.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/user
 */
class DeveloperCollection extends BaseSlugCollection {
  constructor() {
    super('Developer', new SimpleSchema({
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
   * Creates a new developer.
   * @param username {String} the developer's username.
   * @param firstName {String} the developer's first name.
   * @param lastName {String} the developer's last name.
   * @param demographicLevel {String} the developer's demographic level.
   * @param lookingForTeam {Boolean} if the developer is looking for a team.
   * @param challenges {String[]} the challenges the developer is interested in.
   * @param interests {String[]} the developer's interests.
   * @param skills {String[]} the developer's skills.
   * @param tools {String[]} the tools the developer is interested in.
   * @param linkedIn {String} the developer's LinkedIn page (optional).
   * @param gitHub {String} the developer's GitHub page (optional).
   * @param website {String} the developer's website (optional).
   * @param aboutMe {String} a short description.
   * @param isCompliant {Boolean} is the developer compliant.
   * @return {{password: *, profileID: any}|undefined}
   */
  define({
           username, firstName, lastName, demographicLevel, lookingForTeam,
           challenges = [], interests = [], skills = [], tools = [],
           linkedIn = '', gitHub = '', website = '', aboutMe = '',
           isCompliant = false,
         }) {
    if (Meteor.isServer) {
      const role = ROLE.DEVELOPER;
      const slugID = Slugs.define({ name: username }); // ensure the usernames are unique
      const profileID = this._collection.insert({
        username, slugID, firstName, lastName, demographicLevel,
        lookingForTeam, linkedIn, gitHub, website, aboutMe, isCompliant,
      });
      Slugs.updateEntityID(slugID, profileID);
      const { userID, password } = Users.define({ username, role });
      this._collection.update(profileID, { $set: { userID } });
      _.forEach(challenges, (challenge) => DeveloperChallenges.define({ challenge, developer: username }));
      _.forEach(interests, (interest) => DeveloperInterests.define({ interest, developer: username }));
      _.forEach(skills, (skill) => DeveloperSkills.define({ skill, developer: username }));
      _.forEach(tools, (tool) => DeveloperTools.define({ tool, developer: username }));
      return { profileID, password };
    }
    return undefined;
  }

  /**
   * Updates the developer.
   * @param docID {String} the ID of the developer to update.
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
    firstName, lastName, demographicLevel, lookingForTeam, challenges, interests,
    skills, tools, linkedIn, gitHub, website, aboutMe, isCompliant,
  }) {
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
    const developer = this.findSlugByID(docID);
    if (challenges) {
      DeveloperChallenges.removeDeveloper(developer);
      _.forEach(challenges, (challenge) => DeveloperChallenges.define({ challenge, developer }));
    }
    if (interests) {
      DeveloperInterests.removeDeveloper(developer);
      _.forEach(interests, (interest) => DeveloperInterests.define({ interest, developer }));
    }
    if (skills) {
      DeveloperSkills.removeDeveloper(developer);
      _.forEach(skills, (skill) => DeveloperSkills.define({ skill, developer }));
    }
    if (tools) {
      DeveloperTools.removeDeveloper(developer);
      _.forEach(tools, (tool) => DeveloperTools.define({ tool, developer }));
    }
  }

  /**
   * Removes the developer.
   * @param docID {String} the ID of the developer.
   * @throws {Meteor.Error} if the docID is not defined.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    const developer = this.findSlugByID(docID);
    DeveloperChallenges.removeDeveloper(developer);
    DeveloperInterests.removeDeveloper(developer);
    DeveloperSkills.removeDeveloper(developer);
    DeveloperTools.removeDeveloper(developer);
    super.removeIt(docID);
  }

  /**
   * Returns an object representing the developer.
   * @param docID {String} the ID of the developer.
   * @return {{lastName: *, website: *, gitHub: *, challenges: Array, demographicLevel: *,
   * lookingForTeam: *, linkedIn: *, tools: Array, isCompliant: *, aboutMe: *, skills: Array,
   * firstName: *, interests: Array, username: *}}
   */
  dumpOne(docID) {
    this.assertDefined(docID);
    const {
      username, firstName, lastName, demographicLevel, lookingForTeam,
      linkedIn, gitHub, website, aboutMe, isCompliant,
    } = this.findDoc(docID);
    const selector = { developerID: docID };
    const devChallenges = DeveloperChallenges.find(selector).fetch();
    const challenges = _.map(devChallenges, (dC) => Challenges.findSlugByID(dC.challengeID));
    const devInterests = DeveloperInterests.find(selector).fetch();
    const interests = _.map(devInterests, (dI) => Interests.findSlugByID(dI.interestID));
    const devSkills = DeveloperSkills.find(selector).fetch();
    const skills = _.map(devSkills, (dS) => Skills.findSlugByID(dS.skillID));
    const devTools = DeveloperTools.find(selector).fetch();
    const tools = _.map(devTools, (dT) => Tools.findSlugByID(dT.toolID));
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
    this.assertRole(userId, [ROLE.ADMIN, ROLE.DEVELOPER]);
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

}

/**
 * Singleton instance of the DeveloperCollection.
 * @type {api/user.DeveloperCollection}
 * @memberOf api/user
 */
export const Developers = new DeveloperCollection();
