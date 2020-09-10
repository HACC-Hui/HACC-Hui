import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { HACCHui } from '../../api/hacc-hui/HACCHui';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Skills } from '../../api/skill/SkillCollection';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { Developers} from '../../api/user/DeveloperCollection';
import { Tools } from '../../api/tool/ToolCollection';

// Publish all the collections you need.
_.forEach(HACCHui.collections, (collection) => collection.publish());

// Deprecated
Stuffs.publish();

// Need this for the alanning:roles package
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
Meteor.publish('allSkills', function publish() {
  return Skills.find({});
  return this.ready();
});
Meteor.publish('allChallenges', function publish() {
  return Challenges.find({});
  return this.ready();
});
Meteor.publish('allDevp', function publish() {
  return Developers.find({});
  return this.ready();
});
Meteor.publish('allTools', function publish() {
  return Tools.find({});
  return this.ready();
});
