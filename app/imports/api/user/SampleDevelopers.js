import faker from 'faker';
import { Developers } from './DeveloperCollection';
import { getRandomDemographicLevel } from '../level/Levels';
import { makeSampleInterestSlugArray } from '../interest/SampleInterests';
import { makeSampleToolSlugArray } from '../tool/SampleTools';
import { makeSampleChallengeSlugArray } from '../challenge/SampleChallenges';
import { makeSampleSkillSlugArray } from '../skill/SampleSkills';

/**
 * Creates a sample developer.
 * @return {*}
 * @memberOf test-utilities
 */
export const makeSampleDeveloper = () => {
  const username = faker.internet.email();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const demographicLevel = getRandomDemographicLevel();
  const lookingForTeam = faker.random.boolean();
  const challenges = makeSampleChallengeSlugArray();
  const interests = makeSampleInterestSlugArray(2);
  const skills = makeSampleSkillSlugArray(3);
  const tools = makeSampleToolSlugArray(2);
  const linkedIn = faker.internet.url();
  const gitHub = faker.internet.url();
  const website = faker.internet.url();
  const aboutMe = faker.lorem.paragraph();
  return Developers.define({ username, firstName, lastName, demographicLevel,
    lookingForTeam, challenges, interests, skills, tools, linkedIn, gitHub, website, aboutMe });
};
