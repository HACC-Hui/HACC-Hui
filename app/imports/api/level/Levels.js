import _ from 'lodash';
import faker from 'faker';

/** @namespace api/level */

/**
 * The different demographic levels.
 * @type {{PROFESSIONAL: string, COLLEGE: string, HIGH_SCHOOL: string}}
 * @memberOf api/level
 */
export const demographicLevel = {
  HIGH_SCHOOL: 'High school',
  COLLEGE: 'College',
  PROFESSIONAL: 'Professional',
};

/**
 * The different demographic levels.
 * @type {Array}
 * @memberOf api/level
 */
export const demographicLevels = _.values(demographicLevel);

/**
 * The different skill and tool levels.
 * @type {{EXPERIENCED: string, DONT_KNOW: string, NOVICE: string}}
 * @memberOf api/level
 */
export const skillAndToolLevel = {
  DONT_KNOW: 'Don\'t know, but would like to learn',
  NOVICE: 'Novice',
  EXPERIENCED: 'Experienced',
};

/**
 * The different skill and tool levels.
 * @type {Array}
 * @memberOf api/level
 */
export const skillAndToolLevels = _.values(skillAndToolLevel);

/**
 * Returns a random demographic level.
 * @return {*}
 * @memberOf api/test-utilities
 */
export const getRandomDemographicLevel = () => {
  const index = faker.random.number({ min: 0, max: demographicLevels.length - 1 });
  return demographicLevels[index];
};

/**
 * Returns a random skill and tool level.
 * @return {*}
 * @memberOf api/test-utilities
 */
export const getRandomSkillAndToolLevel = () => {
  const index = faker.random.number({ min: 0, max: skillAndToolLevels.length - 1 });
  return skillAndToolLevels[index];
};
