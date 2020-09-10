import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Interests } from './InterestCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('InterestCollection', function testSuite() {

    before(function setup() {
      resetDatabase();
    });

    after(function teardown() {
      resetDatabase();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(5000);
      fc.assert(
          fc.property(fc.lorem(3), fc.lorem(24), (name, description) => {
            const docID = Interests.define({ name, description });
            expect(Interests.isDefined(docID)).to.be.true;
            Interests.removeIt(docID);
            expect(Interests.isDefined(docID)).to.be.false;
          }),
      );
      done();
    });
    it('Cannot define duplicates', function test2() {
      const name = faker.lorem.words();
      const description = faker.lorem.paragraph();
      const docID1 = Interests.define({ name, description });
      expect(Interests.isDefined(docID1)).to.be.true;
      expect(() => Interests.define({ name, description })).to.throw(Error);
    });
    it('Can update', function test3(done) {
      this.timeout(5000);
      let interestDoc = Interests.findOne({});
      const docID = interestDoc._id;
      fc.assert(
          fc.property(fc.lorem(4), fc.lorem(24), (fcName, fcDescription) => {
            Interests.update(docID, { name: fcName, description: fcDescription });
            interestDoc = Interests.findDoc(docID);
            expect(interestDoc.name).to.equal(fcName);
            expect(interestDoc.description).to.equal(fcDescription);
          }),
      );
      done();
    });
    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let interestDoc = Interests.findOne({});
      let docID = interestDoc._id;
      const dumpObject = Interests.dumpOne(docID);
      Interests.removeIt(docID);
      expect(Interests.isDefined(docID)).to.be.false;
      docID = Interests.restoreOne(dumpObject);
      interestDoc = Interests.findDoc(docID);
      expect(interestDoc.name).to.equal(dumpObject.name);
      expect(interestDoc.description).to.equal(dumpObject.description);
    });
  });
}
