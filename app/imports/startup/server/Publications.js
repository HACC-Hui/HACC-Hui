import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Slugs } from '../../api/slug/SlugCollection';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { ChallengeInterests } from '../../api/challenge/ChallengeInterestCollection';
import { Interests } from '../../api/interest/InterestCollection';
import { Skills } from '../../api/skill/SkillCollection';
import { Tools } from '../../api/tool/ToolCollection';
import { Teams } from '../../api/team/TeamCollection';
import { TeamChallenges } from '../../api/team/TeamChallengeCollection';
import { TeamSkills } from '../../api/team/TeamSkillCollection';
import { TeamTools } from '../../api/team/TeamToolCollection';
import { TeamDevelopers } from '../../api/team/TeamDeveloperCollection';

/** Publish all the collections you need. */
Challenges.publish();
ChallengeInterests.publish();
Interests.publish();
Skills.publish();
Slugs.publish();
Teams.publish();
TeamChallenges.publish();
TeamDevelopers.publish();
TeamSkills.publish();
TeamTools.publish();
Tools.publish();
Stuffs.publish();

/** Need this for the alanning:roles package */
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
