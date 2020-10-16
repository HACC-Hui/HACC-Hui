import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Skills } from './SkillCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('SkillCollection', function testSuite() {

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
            const docID = Skills.define({ name, description });
            expect(Skills.isDefined(docID)).to.be.true;
            Skills.removeIt(docID);
            expect(Skills.isDefined(docID)).to.be.false;
          }),
      );
      done();
    });
    it('Cannot define duplicates', function test2() {
      const name = faker.lorem.words();
      const description = faker.lorem.paragraph();
      const docID1 = Skills.define({ name, description });
      expect(Skills.isDefined(docID1)).to.be.true;
      expect(() => Skills.define({ name, description })).to.throw(Error);
    });
    it('Can update', function test3(done) {
      this.timeout(5000);
      let SkillDoc = Skills.findOne({});
      const docID = SkillDoc._id;
      fc.assert(
          fc.property(fc.lorem(4), fc.lorem(24), (fcName, fcDescription) => {
            Skills.update(docID, { name: fcName, description: fcDescription });
            SkillDoc = Skills.findDoc(docID);
            expect(SkillDoc.name).to.equal(fcName);
            expect(SkillDoc.description).to.equal(fcDescription);
          }),
      );
      done();
    });
    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let SkillDoc = Skills.findOne({});
      let docID = SkillDoc._id;
      const dumpObject = Skills.dumpOne(docID);
      Skills.removeIt(docID);
      expect(Skills.isDefined(docID)).to.be.false;
      docID = Skills.restoreOne(dumpObject);
      SkillDoc = Skills.findDoc(docID);
      expect(SkillDoc.name).to.equal(dumpObject.name);
      expect(SkillDoc.description).to.equal(dumpObject.description);
    });
  });
}
