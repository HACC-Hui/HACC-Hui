import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { slugify, Slugs } from './SlugCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('SlugCollection', function testSuite() {
    before(function setup() {
      resetDatabase();
    });

    after(function teardown() {
      resetDatabase();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(5000);
      fc.assert(
          fc.property(fc.lorem(3), (fcSlug) => {
            const name = slugify(fcSlug);
            expect(Slugs.isValidSlugName(name)).to.be.true;
            const docID = Slugs.define({ name });
            expect(Slugs.isDefined(docID)).to.be.true;
            expect(Slugs.isDefined(name)).to.be.true;
            Slugs.removeIt(docID);
            expect(Slugs.isDefined(docID)).to.be.false;
          }),
      );
      done();
    });
    it('Can not define duplicates', function test2() {
      const lName = faker.lorem.word();
      const docID = Slugs.define({ name: lName });
      expect(Slugs.isDefined(docID)).to.be.true;
      expect(() => Slugs.define({ name: lName })).to.throw(Error);
    });
    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const origDoc = Slugs.findOne({});
      let docID = origDoc._id;
      const dumpObject = Slugs.dumpOne(docID);
      Slugs.removeIt(docID);
      expect(Slugs.isDefined(docID)).to.be.false;
      docID = Slugs.restoreOne(dumpObject);
      expect(Slugs.isDefined(docID)).to.be.true;
      const restored = Slugs.findDoc(docID);
      expect(restored.name).to.equal(origDoc.name);
    });
  });
}
