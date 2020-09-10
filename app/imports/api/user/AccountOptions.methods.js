import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Users } from './UserCollection';
import { Developers } from './DeveloperCollection';
import { demographicLevels } from '../level/Levels';
import { makeSampleSkillSlugArray } from '../skill/SampleSkills';

/**
 * Meteor method used to define new instances of Stuff.
 * @param definitionData {Object} the object used in the Stuffs.define method.
 * @memberOf api/stuff
 * @type {ValidatedMethod}
 */
export const usersDeleteMethod = new ValidatedMethod({
  name: 'UserCollection.deleteProfile',
  mixins: [CallPromiseMixin],
  validate: null,
  run(instance) {
    console.log(instance);
    if (Meteor.isServer) {
      const res = Users.deleteProfile(instance);
      return res;
    }
    return '';
  },
});

export const createDeveloperMethod = new ValidatedMethod({
  name: 'DeveloperCollection.define',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    console.log('We in here boys 1');
    const username = 'cmoore@hawaii.edu';
    const firstName = 'Cam';
    const lastName = 'Moore';
    const demographicLevel = demographicLevels[0];
    const lookingForTeam = true;
    const skills = makeSampleSkillSlugArray(2);
    return Developers.define({ username, firstName, lastName, demographicLevel,
      lookingForTeam, skills });
  },
});
