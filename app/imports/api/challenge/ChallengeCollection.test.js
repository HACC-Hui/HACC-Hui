import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { makeSampleInterestSlugArray } from '../interest/SampleInterests';
import { Challenges } from './ChallengeCollection';
/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('ChallengeCollection', function testSuite() {

    before(function setup() {
      resetDatabase();
    });

    after(function teardown() {
      resetDatabase();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(15000);
      fc.assert(
          fc.property(fc.lorem(3), fc.lorem(24), fc.lorem(3),
              fc.lorem(3),
              (fcTitle, description, submissionDetail, pitch) => {
                const title = `${fcTitle}${moment().format('YYYYMMDDHHmmssSSS')}`;
                const interests = makeSampleInterestSlugArray(3);
                const docID = Challenges.define({ title, description, pitch, interests, submissionDetail });
                expect(Challenges.isDefined(docID)).to.be.true;
                const doc = Challenges.findDoc(docID);
                expect(doc.interests).to.have.lengthOf(3);
                Challenges.removeIt(docID);
                expect(Challenges.isDefined(docID)).to.be.false;
              }),
      );
      done();
    });
    it('Can call define with same values, but get same docID', function test2() {
      const title = faker.lorem.words();
      const description = faker.lorem.paragraph();
      const pitch = faker.lorem.words();
      const submissionDetail = faker.lorem.words();
      const interests = makeSampleInterestSlugArray(2);
      const docID1 = Challenges.define({ title, description, interests, pitch, submissionDetail });
      const docID2 = Challenges.define({ title, description, interests, pitch, submissionDetail });
      expect(docID1).to.equal(docID2);
      expect(Challenges.isDefined(docID1)).to.be.true;
    });
  });
}
