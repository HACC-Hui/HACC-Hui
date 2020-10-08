import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Skills } from '../skill/SkillCollection';
import { Teams } from './TeamCollection';
import { skillAndToolLevels } from '../level/Levels';
import { ROLE } from '../role/Role';

/**
 * TeamSkillCollection is a collection of team, skill, and skill level tuples.
 * @extends api/base.BaseCollection
 * @memberOf api/team
 */
class TeamSkillCollection extends BaseCollection {
  constructor() {
    super('TeamSkill', new SimpleSchema({
      teamID: { type: SimpleSchema.RegEx.Id },
      skillID: { type: SimpleSchema.RegEx.Id },
      skillLevel: { type: String, allowedValues: skillAndToolLevels, optional: true },
    }));
  }

  /**
   * Defines a new tuple.
   * @param team {String} the team slug or ID.
   * @param skill {String} the skill slug or ID.
   * @param skillLevel {String} one of the valid skill levels, optional.
   * @return {String} the ID of the new pair.
   */
  define({ team, skill, skillLevel }) {
    const teamID = Teams.findIdBySlug(team);
    const skillID = Skills.findIdBySlug(skill);
    return this._collection.insert({ teamID, skillID, skillLevel });
  }

  /**
   * Updates the given tuple.
   * @param docID {String} the ID of the pair to update.
   * @param team {String} the new team slug or ID (optional).
   * @param skill {String} the new skill slug or ID (optional).
   * @param skillLevel {String} the new sKillLevel (optional).
   * @throws {Meteor.Error} if docID is not defined.
   */
  update(docID, { team, skill, skillLevel }) {
    this.assertDefined(docID);
    const updateData = {};
    if (skill) {
      updateData.skillID = Skills.getID(skill);
    }
    if (team) {
      updateData.teamID = Teams.getID(team);
    }
    if (skillLevel) {
      updateData.skillLevel = skillLevel;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Removes the tuple.
   * @param docID {String} the ID of the tuple.
   */
  removeIt(docID) {
    super.removeIt(docID);
  }

  /**
   * Removes all the tuples with the given team.
   * @param team {String} the team's slug or ID.
   * @throws {Meteor.Error} if the team is not defined.
   */
  removeTeam(team) {
    const teamID = Teams.getID(team);
    this._collection.remove({ teamID });
  }

  /**
   * Removes all the tuples with the given skill.
   * @param skill {String} the skill's slug or ID.
   * @throws {Meteor.Error} if the skill is not defined.
   */
  removeSkill(skill) {
    const skillID = Skills.getID(skill);
    this._collection.remove({ skillID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.PARTICIPANT]);
  }

}

/**
 * Singleton instance of the TeamSkillCollection.
 * @type {api/team.TeamSkillCollection}
 * @memberOf api/team
 */
export const TeamSkills = new TeamSkillCollection();
