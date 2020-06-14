import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Developers } from './DeveloperCollection';
import { demographicLevels } from '../level/Levels';
import { makeSampleSkillSlugArray } from '../skill/SampleSkills';
import { DeveloperSkills } from './DeveloperSkillCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('DeveloperCollection', function testSuite() {
    it('Define', function test() {
      const username = 'cmoore@hawaii.edu';
      const firstName = 'Cam';
      const lastName = 'Moore';
      const demographicLevel = demographicLevels[0];
      const lookingForTeam = true;
      const skills = makeSampleSkillSlugArray(2);
      const { profileID } = Developers.define({ username, firstName, lastName, demographicLevel,
        lookingForTeam, skills });
      expect(Developers.isDefined(profileID)).to.be.true;
      expect(DeveloperSkills.find({ developerID: profileID }).fetch()).to.have.lengthOf(2);
    });
  });
}
