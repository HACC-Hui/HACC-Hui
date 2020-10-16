import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import { Participants } from './ParticipantCollection';
import { demographicLevels } from '../level/Levels';
import { makeSampleSkillSlugArray } from '../skill/SampleSkills';
import { ParticipantSkills } from './ParticipantSkillCollection';
import { makeSampleToolSlugArray } from '../tool/SampleTools';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('ParticipantCollection', function testSuite() {
    it('Define', function test() {
      const username = 'cmoore@hawaii.edu';
      const firstName = 'Cam';
      const lastName = 'Moore';
      const demographicLevel = demographicLevels[0];
      const lookingForTeam = true;
      const skills = makeSampleSkillSlugArray(2);
      const tools = makeSampleToolSlugArray();
      const { profileID } = Participants.define({ username, firstName, lastName, demographicLevel,
        lookingForTeam, skills, tools });
      expect(Participants.isDefined(profileID)).to.be.true;
      expect(ParticipantSkills.find({ participantID: profileID }).fetch()).to.have.lengthOf(2);
    });

    it('update', function test() {
      const participant = Participants.findOne();
      // console.log(participant);
      const skills = makeSampleSkillSlugArray(3);
      const firstName = faker.name.firstName();
      const docID = participant._id;
      expect(Participants.isDefined(participant._id)).to.be.true;
      Participants.update(docID, { firstName, skills });
      expect(ParticipantSkills.find({ participantID: docID }).fetch()).to.have.lengthOf(3);
    });
  });
}
