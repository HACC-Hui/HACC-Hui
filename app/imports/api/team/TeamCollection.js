import SimpleSchema from "simpl-schema";
import _ from "lodash";
import BaseSlugCollection from "../base/BaseSlugCollection";
import { slugify, Slugs } from "../slug/SlugCollection";
import { TeamChallenges } from "./TeamChallengeCollection";
import { TeamSkills } from "./TeamSkillCollection";
import { TeamTools } from "./TeamToolCollection";
import { TeamParticipants } from "./TeamParticipantCollection";
import { Challenges } from "../challenge/ChallengeCollection";
import { Participants } from "../user/ParticipantCollection";
import { Skills } from "../skill/SkillCollection";
import { Tools } from "../tool/ToolCollection";
import { ROLE } from "../role/Role";

/** @namespace api/team */

/**
 * TeamCollection holds the information for each of the HACC-Hui teams.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/team
 */
class TeamCollection extends BaseSlugCollection {
  constructor() {
    super(
      "Team",
      new SimpleSchema({
        name: { type: String },
        slugID: { type: String },
        description: { type: String },
        gitHubRepo: { type: String, optional: true },
        devPostPage: { type: String, optional: true },
        owner: { type: SimpleSchema.RegEx.Id },
        open: { type: Boolean },
        affiliation: { type: String, optional: true }
      })
    );
  }

  /**
   * Defines a new Team.
   * @param name {String} The name of the Team.
   * @param description {String} The team's description, optional.
   * @param gitHubRepo {String} The team's GitHub Repository, optional.
   * @param devPostPage {String} The team's devpost page, optional.
   * @param owner {String} The team owner.
   * @param open {boolean} is the team open for participants?
   * @param challenges {String[]} the challenges this team wants to work on.
   * @param skills {String[]} the skills this team is looking for.
   * @param tools {String[]} the tools this team wants to use.
   * @param participants {String[]} the participants on the team.
   * @param affiliation {String} the affiliation for this team, optional.
   * @return {string} the id of the team.
   */
  define({
    name,
    description = "",
    gitHubRepo = "",
    devPostPage = "",
    owner,
    open = true,
    challenges,
    skills,
    tools,
    participants = [],
    affiliation = ""
  }) {
    // console.log('TeamCollection.define', name, description, skills, tools, affiliation);
    const team = slugify(name);
    const slugID = Slugs.define({ name: team });
    // check to see if owner is a slug
    let ownerID;
    if (Slugs.isDefined(owner)) {
      ownerID = Slugs.getEntityID(owner);
    } else {
      ownerID = owner;
    }
    const teamID = this._collection.insert({
      name,
      slugID,
      description,
      gitHubRepo,
      devPostPage,
      owner: ownerID,
      open,
      affiliation
    });
    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, teamID);
    _.forEach(challenges, challenge =>
      TeamChallenges.define({ team, challenge })
    );
    _.forEach(skills, skill => {
      TeamSkills.define({ team, skill });
    });
    _.forEach(tools, tool => {
      // console.log('TeamCollection defining tools', t);
      TeamTools.define({ team, tool });
    });
    _.forEach(participants, participant =>
      TeamParticipants.define({ team, participant })
    );
    if (!_.includes(participants, owner)) {
      TeamParticipants.define({ team, participant: owner });
    }
    return teamID;
  }

  /**
   * Updates the given team.
   * @param docID {String} the ID or slug of the team.
   * @param name {String} the new team name (optional).
   * @param description {String} the new team description (optional).
   * @param open {boolean} the new open value (optional).
   * @param challenges {String[]} the new set of challenges (optional).
   * @param skills {String[]} the new set of skills (optional).
   * @param tools {String[]} the new set of tools (optional).
   * @param participants {String[]} the new set of participants (optional).
   * @param affiliation {string} the affiliation for this team, optional.
   */
  update(
    docID,
    {
      name,
      description,
      open,
      challenges,
      skills,
      tools,
      participants,
      affiliation
    }
  ) {
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
    if (affiliation) {
      updateData.affiliation = affiliation;
    }
    this._collection.update(docID, { $set: updateData });
    const selector = { teamID: docID };
    const team = this.findSlugByID(docID);
    if (challenges) {
      TeamChallenges.removeTeam(team);
      _.forEach(challenges, challenge =>
        TeamChallenges.define({ team, challenge })
      );
    }
    if (skills) {
      const teamSkills = TeamSkills.find(selector).fetch();
      _.forEach(teamSkills, tS => TeamSkills.removeIt(tS._id));
      _.forEach(skills, skill => {
        TeamSkills.define({ team, skill });
      });
    }
    if (tools) {
      const teamTools = TeamTools.find(selector).fetch();
      _.forEach(teamTools, tT => TeamTools.removeIt(tT._id));
      _.forEach(tools, tool => {
        TeamTools.define({ team, tool });
      });
    }
    if (participants) {
      const owner = this.findDoc(docID).owner;
      const teamParticipants = TeamParticipants.find(selector).fetch();
      _.forEach(teamParticipants, tD => TeamParticipants.removeIt(tD._id));
      _.forEach(participants, participant =>
        TeamParticipants.define({ team, participant })
      );
      if (!_.includes(participants, owner)) {
        TeamParticipants.define({ team, participant: owner });
      }
    }
  }

  /**
   * Removes the given team.
   * @param docID {String} the ID of the team to remove.
   * @throws {Meteor.Error} if the team isn't defined.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    const team = this.findSlugByID(docID);
    TeamChallenges.removeTeam(team);
    TeamParticipants.removeTeam(team);
    TeamSkills.removeTeam(team);
    TeamTools.removeTeam(team);
    this._collection.remove({ _id: docID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.PARTICIPANT]);
  }

  /**
   * Returns an object representing the given team.
   * @param docID {string} the ID of the team.
   * @return {{owner: *, skills: Array, challenges: Array, participants: Array, name: *,
   *   description: *, tools: Array, open: *}}
   * @throws {Meteor.Error} if the team isn't defined.
   */
  dumpOne(docID) {
    this.assertDefined(docID);
    // console.log('Teams.dumpOne', docID);
    const { _id, name, description, owner, open, affiliation } = this.findDoc(
      docID
    );
    const selector = { teamID: _id };
    const teamChallenges = TeamChallenges.find(selector).fetch();
    const challenges = _.map(teamChallenges, tC =>
      Challenges.findSlugByID(tC.challengeID)
    );
    const teamParticipants = TeamParticipants.find(selector).fetch();
    const participants = _.map(teamParticipants, tD =>
      Participants.findSlugByID(tD.participantID)
    );
    const ownerSlug = Participants.findSlugByID(owner);
    const teamSkills = TeamSkills.find(selector).fetch();
    const skills = _.map(teamSkills, tS => {
      const skill = Skills.findSlugByID(tS.skillID);
      const skillLevel = tS.skillLevel;
      return {
        skill,
        skillLevel
      };
    });
    const teamTools = TeamTools.find(selector).fetch();
    const tools = _.map(teamTools, tT => {
      const tool = Tools.findSlugByID(tT.toolID);
      const toolLevel = tT.toolLevel;
      return {
        tool,
        toolLevel
      };
    });
    // console.log('Teams.dumpOne', skills, tools);
    return {
      name,
      description,
      owner: ownerSlug,
      open,
      affiliation,
      challenges,
      participants,
      skills,
      tools
    };
  }
}

/**
 * Singleton instance of the TeamCollection.
 * @type {api/team.TeamCollection}
 * @memberOf api/team
 */
export const Teams = new TeamCollection();
