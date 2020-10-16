import moment from 'moment';
import faker from 'faker';
import _ from 'lodash';
import { Tools } from './ToolCollection';
import { Slugs } from '../slug/SlugCollection';
import { getRandomSkillAndToolLevel } from '../level/Levels';

/**
 * Creates an Tool with a unique slug and returns its docID.
 * Also creates a new ToolType.
 * @returns { String } The docID for the newly generated Tool.
 * @memberOf test-utilities
 */
export function makeSampleTool() {
  const name = `${faker.lorem.word()}${moment().format('YYYYMMDDHHmmssSSS')}`;
  const description = faker.lorem.paragraph();
  // console.log('makeSampleTool', { name, slug, description, ToolType });
  return Tools.define({ name, description });
}

/**
 * Returns an array of ToolIDs.
 * @param {number} numTools the number of ToolIDs. Defaults to 1.
 * @returns {string[]}
 * @memberOf test-utilities
 */
export function makeSampleToolArray(numTools = 1) {
  const retVal = [];
  for (let i = 0; i < numTools; i++) {
    retVal.push(makeSampleTool());
  }
  return retVal;
}
/**
 * Returns an array of defined Tool slugs.
 * @param numTools the number of Tools to define. Defaults to 1.
 * @return {string[]} An array of defined Tool Slugs.
 * @memberOf test-utilities
 */
export function makeSampleToolSlugArray(numTools = 1) {
  const ids = makeSampleToolArray(numTools);
  return _.map(ids, (id) => {
    const doc = Tools.findDoc(id);
    return Slugs.getNameFromID(doc.slugID);
  });
}

export function makeSampleToolLevelArray(numTools = 1) {
  const slugs = makeSampleToolSlugArray(numTools);
  return _.map(slugs, (slug) => {
        const retVal = {
          slug,
          toolLevel: getRandomSkillAndToolLevel(),
        };
        return retVal;
      });
}
