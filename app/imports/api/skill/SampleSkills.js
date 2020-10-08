import moment from 'moment';
import faker from 'faker';
import _ from 'lodash';
import { Skills } from './SkillCollection';
import { Slugs } from '../slug/SlugCollection';
import { getRandomSkillAndToolLevel } from '../level/Levels';

/**
 * Creates an Skill with a unique slug and returns its docID.
 * Also creates a new SkillType.
 * @returns { String } The docID for the newly generated Skill.
 * @memberOf test-utilities
 */
export function makeSampleSkill() {
  const name = `${faker.lorem.word()}${moment().format('YYYYMMDDHHmmssSSS')}`;
  const description = faker.lorem.paragraph();
  // console.log('makeSampleSkill', { name, slug, description, SkillType });
  return Skills.define({ name, description });
}

/**
 * Returns an array of SkillIDs.
 * @param {number} numSkills the number of SkillIDs. Defaults to 1.
 * @returns {string[]}
 * @memberOf test-utilities
 */
export function makeSampleSkillArray(numSkills = 1) {
  const retVal = [];
  for (let i = 0; i < numSkills; i++) {
    retVal.push(makeSampleSkill());
  }
  return retVal;
}
/**
 * Returns an array of defined Skill slugs.
 * @param numSkills the number of Skills to define. Defaults to 1.
 * @return {string[]} An array of defined Skill Slugs.
 * @memberOf test-utilities
 */
export function makeSampleSkillSlugArray(numSkills = 1) {
  const ids = makeSampleSkillArray(numSkills);
  return _.map(ids, (id) => {
    const doc = Skills.findDoc(id);
    return Slugs.getNameFromID(doc.slugID);
  });
}

export function makeSampleSkillLevelArray(numTools = 1) {
  const slugs = makeSampleSkillSlugArray(numTools);
  return _.map(slugs, (slug) => {
    const retVal = {
      slug,
      skillLevel: getRandomSkillAndToolLevel(),
    };
    return retVal;
  });
}
