import { _ } from 'meteor/erasaur:meteor-lodash';
import faker from 'faker';

export const demographicLevel = {
  HIGH_SCHOOL: 'High school',
  COLLEGE: 'College',
  PROFESSIONAL: 'Professional',
};

export const demographicLevels = _.values(demographicLevel);

export const skillAndToolLevel = {
  NOVICE: 'Novice',
  EXPERIENCED: 'Experienced',
  DONT_KNOW: 'Don\'t know, but would like to learn',
};

export const skillAndToolLevels = _.values(skillAndToolLevel);

export const getRandomDemographicLevel = () => {
  const index = faker.random.number({ min: 0, max: demographicLevels.length - 1 });
  return demographicLevels[index];
};
