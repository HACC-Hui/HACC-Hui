import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';
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
    }));
  }

  define({ username, firstName, lastName, demographicLevel, lookingForTeam,
         challenges = [], interests = [], skills = [], tools = [],
         linkedIn = '', gitHub = '', website = '', aboutMe = '' }) {
    if (Meteor.isServer) {
      const role = ROLE.DEVELOPER;
      const slugID = Slugs.define({ name: username }); // ensure the usernames are unique
      const profileID = this._collection.insert({ username, slugID, firstName, lastName, demographicLevel,
        lookingForTeam, linkedIn, gitHub, website, aboutMe });
      Slugs.updateEntityID(slugID, profileID);
      const { userID, password } = Users.define({ username, role });
      this._collection.update(profileID, { $set: { userID } });
      _.each(challenges, (challenge) => DeveloperChallenges.define({ challenge, developer: username }));
      _.each(interests, (interest) => DeveloperInterests.define({ interest, developer: username }));
      _.each(skills, (skill) => DeveloperSkills.define({ skill, developer: username }));
      _.each(tools, (tool) => DeveloperTools.define({ tool, developer: username }));
      return { profileID, password };
    }
    return undefined;
  }

  update(docID, { firstName, lastName, demographicLevel, lookingForTeam, challenges, interests,
    skills, tools, linkedIn, gitHub, website, aboutMe }) {
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
    if (lookingForTeam) {
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
    this._collection.update(docID, { $set: updateData });
    const developer = this.findSlugByID(docID);
    if (challenges) {
      DeveloperChallenges.removeDeveloper(developer);
      _.each(challenges, (challenge) => DeveloperChallenges.define({ challenge, developer }));
    }
    if (interests) {
      DeveloperInterests.removeDeveloper(developer);
      _.each(interests, (interest) => DeveloperInterests.define({ interest, developer }));
    }
    if (skills) {
      DeveloperSkills.removeDeveloper(developer);
      _.each(skills, (skill) => DeveloperSkills.define({ skill, developer }));
    }
    if (tools) {
      DeveloperTools.removeDeveloper(developer);
      _.each(tools, (tool) => DeveloperTools.define({ tool, developer }));
    }
  }

  removeIt(docID) {
    this.assertDefined(docID);
    const developer = this.findSlugByID(docID);
    DeveloperChallenges.removeDeveloper(developer);
    DeveloperInterests.removeDeveloper(developer);
    DeveloperSkills.removeDeveloper(developer);
    DeveloperTools.removeDeveloper(developer);
    super.removeIt(docID);
  }

  dumpOne(docID) {
    this.assertDefined(docID);
    const { username, firstName, lastName, demographicLevel, lookingForTeam,
      linkedIn, gitHub, website, aboutMe } = this.findDoc(docID);
    const selector = { developerID: docID };
    const devChallenges = DeveloperChallenges.find(selector).fetch();
    const challenges = _.map(devChallenges, (dC) => Challenges.findSlugByID(dC.challengeID));
    const devInterests = DeveloperInterests.find(selector).fetch();
    const interests = _.map(devInterests, (dI) => Interests.findSlugByID(dI.interestID));
    const devSkills = DeveloperSkills.find(selector).fetch();
    const skills = _.map(devSkills, (dS) => Skills.findSlugByID(dS.skillID));
    const devTools = DeveloperTools.find(selector).fetch();
    const tools = _.map(devTools, (dT) => Tools.findSlugByID(dT.toolID));
    return { username, firstName, lastName, demographicLevel, lookingForTeam,
      linkedIn, gitHub, website, aboutMe, challenges, interests, skills, tools };
  }

  /**
   * Returns non-null if the user has a profile in this collection.
   * @param user The user (either their username (email) or their userID).
   * @return The profile document if the profile exists, or null if not found.
   * @throws { Meteor.Error } If user is not a valid user.
   */
  hasProfile(user) {
    const userID = Users.getID(user);
    return this.collection.findOne({ userID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.DEVELOPER]);
  }

}

export const Developers = new DeveloperCollection();
