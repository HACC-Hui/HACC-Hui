import SimpleSchema from 'simpl-schema';
import { _ } from 'lodash';
import BaseSlugCollection from '../base/BaseSlugCollection';
import slugify, { Slugs } from '../slug/SlugCollection';
import { TeamChallenges } from './TeamChallengeCollection';
import { TeamSkills } from './TeamSkillCollection';
import { TeamTools } from './TeamToolCollection';
import { TeamDevelopers } from './TeamDeveloperCollection';
import { Challenges } from '../challenge/ChallengeCollection';
import { Developers } from '../user/DeveloperCollection';
import { Skills } from '../skill/SkillCollection';
import { Tools } from '../tool/ToolCollection';

class TeamCollection extends BaseSlugCollection {
  constructor() {
    super('Team', new SimpleSchema({
      name: { type: String },
      slugID: { type: String },
      description: { type: String },
      gitHubRepo: { type: String },
      devPostPage: { type: String },
      owner: { type: SimpleSchema.RegEx.Id },
      open: { type: Boolean },
    }));
  }

  /**
   * Defines a new Team.
   * @param name The name of the Team.
   * @param description The team's description, optional.
   * @param gitHubRepo The team's GitHub Repository, optional.
   * @param devPostPage The team's devpost page, optional.
   * @param owner The team owner.
   * @param open is the team open for developers?
   * @param challenges the challenges this team wants to work on.
   * @param skills the skills this team is looking for.
   * @param tools the tools this team wants to use.
   * @param developers the developers on the team.
   * @return {string} the id of the team.
   */
  define({ name, description = '', gitHubRepo = '', devPostPage = '',
           owner, open = true, challenges, skills, tools, developers = [] }) {
    const team = slugify(name);
    const slugID = Slugs.define({ name: team });
    const teamID = this._collection.insert({ name, slugID, description, gitHubRepo, devPostPage, owner, open });
    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, teamID);
    _.each(challenges, (challenge) => TeamChallenges.define({ team, challenge }));
    _.each(skills, (skill) => TeamSkills.define({ team, skill }));
    _.each(tools, (tool) => TeamTools.define({ team, tool }));
    _.each(developers, (developer) => TeamDevelopers.define({ team, developer }));
    TeamDevelopers.define({ team, developer: owner });
    return teamID;
  }

  update(docID, { name, description, open, challenges, skills, tools, developers }) {
    this.assertDefined(docID);
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (description) {
      updateData.description = description;
    }
    if (_.isBoolean(open)) {
      updateData.open = open;
    }
    this._collection.update(docID, { $set: updateData });
    const selector = { teamID: docID };
    const team = this.findSlugByID(docID);
    if (challenges) {
     TeamChallenges.removeTeam(team);
      _.each(challenges, (challenge) => TeamChallenges.define({ team, challenge }));
    }
    if (skills) {
      const teamSkills = TeamSkills.find(selector).fetch();
      _.each(teamSkills, (tS) => TeamSkills.removeIt(tS._id));
      _.each(skills, (skill) => TeamSkills.define({ team, skill }));
    }
    if (tools) {
      const teamTools = TeamTools.find(selector).fetch();
      _.each(teamTools, (tT) => TeamTools.removeIt(tT._id));
      _.each(tools, (tool) => TeamTools.define({ team, tool }));
    }
    if (developers) {
      const owner = this.findDoc(docID).owner;
      const teamDevelopers = TeamDevelopers.find(selector).fetch();
      _.each(teamDevelopers, (tD) => TeamDevelopers.removeIt(tD._id));
      _.each(developers, (developer) => TeamDevelopers.define({ team, developer }));
      TeamDevelopers.define({ team, developer: owner });
    }
  }

  removeIt(docID) {
    this.assertDefined(docID);
    const team = this.findSlugByID(docID);
    TeamChallenges.removeTeam(team);
    TeamDevelopers.removeTeam(team);
    TeamSkills.removeTeam(team);
    TeamTools.removeTeam(team);
    this._collection.remove({ _id: docID });
  }

  dumpOne(docID) {
    this.assertDefined(docID);
    const { name, description, owner, open } = this.findDoc(docID);
    const selector = { teamID: docID };
    const teamChallenges = TeamChallenges.find(selector).fetch();
    const challenges = _.map(teamChallenges, (tC) => Challenges.findSlugByID(tC.challengeID));
    const teamDevelopers = TeamDevelopers.find(selector).fetch();
    const developers = _.map(teamDevelopers, (tD) => Developers.findSlugByID(tD.developerID));
    const teamSkills = TeamSkills.find(selector).fetch();
    const skills = _.map(teamSkills, (tS) => Skills.findSlugByID(tS.skillID));
    const teamTools = TeamTools.find(selector).fetch();
    const tools = _.map(teamTools, (tT) => Tools.findSlugByID(tT.toolID));
    return { name, description, owner, open, challenges, developers, skills, tools };
  }
}

export const Teams = new TeamCollection();
