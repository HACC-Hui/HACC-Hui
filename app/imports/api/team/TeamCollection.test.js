import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import moment from 'moment';
import fc from 'fast-check';
import faker from 'faker';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Teams } from './TeamCollection';
import { makeSampleChallengeSlugArray } from '../challenge/SampleChallenges';
import { makeSampleToolSlugArray } from '../tool/SampleTools';
import { makeSampleSkillSlugArray } from '../skill/SampleSkills';
import { makeSampleParticipant } from '../user/SampleParticipants';
import { TeamChallenges } from './TeamChallengeCollection';
import { TeamParticipants } from './TeamParticipantCollection';
import { TeamSkills } from './TeamSkillCollection';
import { TeamTools } from './TeamToolCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('TeamCollection', function testSuite() {

    before(function setup() {
      resetDatabase();
    });

    after(function teardown() {
      resetDatabase();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(50000);
      fc.assert(
          fc.property(fc.lorem(3), fc.lorem(24), fc.boolean(), fc.float(),
              (fcName, description, open, num) => {
                const name = `${num}${fcName}${moment().format('YYYYMMDDHHmmssSSS')}`;
                const { profileID } = makeSampleParticipant();
                const owner = profileID;
                const challenges = makeSampleChallengeSlugArray();
                const tools = makeSampleToolSlugArray();
                const skills = makeSampleSkillSlugArray();
                const gitHubRepo = faker.internet.url();
                const devPostPage = faker.internet.url();
                const docID = Teams.define({
                  name, description, open, owner, gitHubRepo,
                  devPostPage, challenges, tools, skills,
                });
                expect(Teams.isDefined(docID)).to.be.true;
                // console.log('dump', JSON.stringify(Teams.dumpOne(docID)));
                const doc = Teams.findDoc(docID);
                expect(doc.name).to.equal(name);
                expect(doc.description).to.equal(description);
                const selector = { teamID: docID };
                expect(TeamChallenges.find(selector).fetch()).to.have.lengthOf(challenges.length);
                expect(TeamParticipants.find(selector).fetch()).to.have.lengthOf(1);
                expect(TeamSkills.find(selector).fetch()).to.have.lengthOf(skills.length);
                expect(TeamTools.find(selector).fetch()).to.have.lengthOf(tools.length);
                Teams.removeIt(docID);
                expect(Teams.isDefined(docID)).to.be.false;
                expect(TeamChallenges.find(selector).fetch()).to.have.lengthOf(0);
                expect(TeamParticipants.find(selector).fetch()).to.have.lengthOf(0);
                expect(TeamSkills.find(selector).fetch()).to.have.lengthOf(0);
                expect(TeamTools.find(selector).fetch()).to.have.lengthOf(0);
              }),
      );
      done();
    });
  });
}
