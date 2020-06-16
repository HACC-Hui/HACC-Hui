import faker from 'faker';
import { _ } from 'lodash';
import { makeSampleInterestSlugArray } from '../interest/SampleInterests';
import { Challenges } from './ChallengeCollection';

export const makeSampleChallenge = () => {
  const title = faker.lorem.sentence();
  const description = faker.lorem.paragraph();
  const submissionDetail = faker.internet.url();
  const interests = makeSampleInterestSlugArray(2);
  const pitch = faker.internet.url();
  return Challenges.define({ title, description, interests, submissionDetail, pitch });
};

export const makeSampleChallengeArray = (num = 1) => {
  const retVal = [];
  for (let i = 0; i < num; i++) {
    retVal.push(makeSampleChallenge());
  }
  return retVal;
};

export const makeSampleChallengeSlugArray = (num = 1) => {
  const ids = makeSampleChallengeArray(num);
  return _.map(ids, (id) => Challenges.findSlugByID(id));
};
