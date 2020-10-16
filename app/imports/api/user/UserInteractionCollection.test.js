import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { makeSampleParticipant } from './SampleParticipants';
import { UserInteractions } from './UserInteractionCollection';
import { Participants } from './ParticipantCollection';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('UserInteractionCollection', function testSuite() {
    let username;
    before(function setup() {
      resetDatabase();
      const { profileID } = makeSampleParticipant();
      username = Participants.findDoc(profileID).username;
    });

    after(function teardown() {
      resetDatabase();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(5000);
      fc.assert(
          fc.property(fc.lorem(1), fc.array(fc.lorem(1), 1, 5), (type, typeData) => {
            const docID = UserInteractions.define({ username, type, typeData });
            expect(UserInteractions.isDefined(docID)).to.be.true;
            UserInteractions.removeIt(docID);
            expect(UserInteractions.isDefined(docID)).to.be.false;
          }),
      );
      done();
    });
    it('Cannot define duplicates', function test2() {
      const type = faker.lorem.word();
      const typeData = [faker.lorem.word(), faker.lorem.word()];
      const docID1 = UserInteractions.define({ username, type, typeData });
      const docID1Object = UserInteractions.findOne({ _id: docID1 });
      const docID1Timestamp = docID1Object.timestamp;
      const docID2 = UserInteractions.define({ username, type, typeData, timestamp: docID1Timestamp });

      expect(docID1).to.equal(docID2);
      expect(UserInteractions.isDefined(docID1)).to.be.true;
      UserInteractions.removeIt(docID2);
      expect(UserInteractions.isDefined(docID1)).to.be.false;
    });
    it('Can restoreOne then dumpOne', function test3() {
      fc.assert(
          fc.property(fc.lorem(1), fc.lorem(1), fc.array(fc.lorem(1),
              1, 5), fc.date(), (name, type, typeData, timestamp) => {
            const dumpObject = {
              username: name,
              type,
              typeData,
              timestamp,
            };
            const docID = UserInteractions.restoreOne(dumpObject);
            expect(UserInteractions.isDefined(docID)).to.be.true;
            const dumpObject2 = UserInteractions.dumpOne(docID);
            expect(dumpObject2.username).to.equal(dumpObject.username);
            expect(dumpObject2.type).to.equal(dumpObject.type);
            expect(dumpObject2.typeData.length).to.equal(dumpObject.typeData.length);
            for (let i = 0; i < dumpObject2.typeData.length; i++) {
              expect(dumpObject2.typeData[i]).to.equal(dumpObject.typeData[i]);
            }
          }),
      );
    });

    it('Can removeUser', function test5() {
      fc.assert(
          fc.property(fc.lorem(1), fc.array(fc.lorem(1), 1, 5), (type, typeData) => {
            UserInteractions.define({ username, type, typeData });
          }),
      );
      UserInteractions.removeUser(username);
      const interactions = UserInteractions.find({ username }).fetch();
      expect(interactions).to.have.lengthOf(0);
    });

  });
}
