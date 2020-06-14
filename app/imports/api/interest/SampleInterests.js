import moment from 'moment';
import faker from 'faker';
import { _ } from 'meteor/underscore';
import { Interests } from './InterestCollection';
import { Slugs } from '../slug/SlugCollection';

/**
 * Creates an Interest with a unique slug and returns its docID.
 * Also creates a new InterestType.
 * @returns { String } The docID for the newly generated Interest.
 * @memberOf api/interest
 */
export function makeSampleInterest() {
  const name = `${faker.lorem.word()}${moment().format('YYYYMMDDHHmmssSSS')}`;
  const description = faker.lorem.paragraph();
  // console.log('makeSampleInterest', { name, slug, description, interestType });
  return Interests.define({ name, description });
}

/**
 * Returns an array of interestIDs.
 * @param {number} numInterests the number of interestIDs. Defaults to 1.
 * @returns {string[]}
 */
export function makeSampleInterestArray(numInterests = 1) {
  const retVal = [];
  for (let i = 0; i < numInterests; i++) {
    retVal.push(makeSampleInterest());
  }
  return retVal;
}
/**
 * Returns an array of defined Interest slugs.
 * @param numInterests the number of Interests to define. Defaults to 1.
 * @return {string[]} An array of defined Interest Slugs.
 */
export function makeSampleInterestSlugArray(numInterests = 1) {
  const ids = makeSampleInterestArray(numInterests);
  return _.map(ids, (id) => {
    const doc = Interests.findDoc(id);
    return Slugs.getNameFromID(doc.slugID);
  });
}
