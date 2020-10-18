import faker from 'faker';
import { _ } from 'lodash';
import { makeSampleInterestSlugArray } from '../interest/SampleInterests';
import { Challenges } from './ChallengeCollection';

/**
 * Creates a sample challenge for testing purposes.
 * @memberOf test-utilities
 * @return {string} the ID of the new challenge.
 */
export const makeSampleChallenge = () => {
  const title = faker.lorem.sentence();
  const description = faker.lorem.paragraph();
  const submissionDetail = faker.internet.url();
  const interests = makeSampleInterestSlugArray(2);
  const pitch = faker.internet.url();
  return Challenges.define({ title, description, interests, submissionDetail, pitch });
};

/**
 * Creates an array of challenge ids.
 * @param num {number} the number of challenges to create. Defaults to 1.
 * @return {string[]} an array of the challenge ids.
 * @memberOf test-utilities
 */
export const makeSampleChallengeArray = (num = 1) => {
  const retVal = [];
  for (let i = 0; i < num; i++) {
    retVal.push(makeSampleChallenge());
  }
  return retVal;
};

/**
 * Creates an array of challenge slugs.
 * @param num {number} the number of challenges to create. Defaults to 1.
 * @return {Array} an array of the challenge slugs.
 * @memberOf test-utilities
 */
export const makeSampleChallengeSlugArray = (num = 1) => {
  const ids = makeSampleChallengeArray(num);
  return _.map(ids, (id) => Challenges.findSlugByID(id));
};
