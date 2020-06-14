import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Skills } from '../skill/SkillCollection';
import { Teams } from './TeamCollection';
import { skillAndToolLevels } from '../level/Levels';
import { ROLE } from '../role/Role';

class TeamSkillCollection extends BaseCollection {
  constructor() {
    super('TeamSkill', new SimpleSchema({
      teamID: { type: SimpleSchema.RegEx.Id },
      skillID: { type: SimpleSchema.RegEx.Id },
      skillLevel: { type: String, allowedValues: skillAndToolLevels, optional: true },
    }));
  }

  define({ team, skill }) {
    const teamID = Teams.findIdBySlug(team);
    const skillID = Skills.findIdBySlug(skill);
    return this._collection.insert({ teamID, skillID });
  }

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

  removeIt(docID) {
    super.removeIt(docID);
  }

  removeTeam(team) {
    const teamID = Teams.getID(team);
    this._collection.remove({ teamID });
  }

  removeSkill(skill) {
    const skillID = Skills.getID(skill);
    this._collection.remove({ skillID });
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.DEVELOPER]);
  }

}

export const TeamSkills = new TeamSkillCollection();
