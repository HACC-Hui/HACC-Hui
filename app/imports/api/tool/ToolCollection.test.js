import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Tools } from './ToolCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('ToolCollection', function testSuite() {

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
            const docID = Tools.define({ name, description });
            expect(Tools.isDefined(docID)).to.be.true;
            Tools.removeIt(docID);
            expect(Tools.isDefined(docID)).to.be.false;
          }),
      );
      done();
    });
    it('Cannot define duplicates', function test2() {
      const name = faker.lorem.words();
      const description = faker.lorem.paragraph();
      const docID1 = Tools.define({ name, description });
      expect(Tools.isDefined(docID1)).to.be.true;
      expect(() => Tools.define({ name, description })).to.throw(Error);
    });
    it('Can update', function test3(done) {
      this.timeout(5000);
      let ToolDoc = Tools.findOne({});
      const docID = ToolDoc._id;
      fc.assert(
          fc.property(fc.lorem(4), fc.lorem(24), (fcName, fcDescription) => {
            Tools.update(docID, { name: fcName, description: fcDescription });
            ToolDoc = Tools.findDoc(docID);
            expect(ToolDoc.name).to.equal(fcName);
            expect(ToolDoc.description).to.equal(fcDescription);
          }),
      );
      done();
    });
    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let ToolDoc = Tools.findOne({});
      let docID = ToolDoc._id;
      const dumpObject = Tools.dumpOne(docID);
      Tools.removeIt(docID);
      expect(Tools.isDefined(docID)).to.be.false;
      docID = Tools.restoreOne(dumpObject);
      ToolDoc = Tools.findDoc(docID);
      expect(ToolDoc.name).to.equal(dumpObject.name);
      expect(ToolDoc.description).to.equal(dumpObject.description);
    });
  });
}
