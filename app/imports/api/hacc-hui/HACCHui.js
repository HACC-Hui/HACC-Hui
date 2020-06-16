import { _ } from 'meteor/erasaur:meteor-lodash';
import { Meteor } from 'meteor/meteor';
import { Challenges } from '../challenge/ChallengeCollection';
import { ChallengeInterests } from '../challenge/ChallengeInterestCollection';
import { Interests } from '../interest/InterestCollection';
import { Skills } from '../skill/SkillCollection';
import { Slugs } from '../slug/SlugCollection';
import { Teams } from '../team/TeamCollection';
import { TeamChallenges } from '../team/TeamChallengeCollection';
import { TeamDevelopers } from '../team/TeamDeveloperCollection';
import { TeamSkills } from '../team/TeamSkillCollection';
import { TeamTools } from '../team/TeamToolCollection';
import { Tools } from '../tool/ToolCollection';
import { Developers } from '../user/DeveloperCollection';
import { DeveloperChallenges } from '../user/DeveloperChallengeCollection';
import { DeveloperInterests } from '../user/DeveloperInterestCollection';
import { DeveloperSkills } from '../user/DeveloperSkillCollection';
import { DeveloperTools } from '../user/DeveloperToolCollection';
import { Administrators } from '../user/AdministratorCollection';
import { SlackUsers } from '../slackbot/SlackUserCollection';

class HACCHuiClass {
  constructor() {
    this.collections = [
        Administrators,
        Challenges,
        ChallengeInterests,
        Developers,
        DeveloperChallenges,
        DeveloperInterests,
        DeveloperSkills,
        DeveloperTools,
        Interests,
        Skills,
        SlackUsers,
        Slugs,
        Teams,
        TeamChallenges,
        TeamDevelopers,
        TeamSkills,
        TeamTools,
        Tools,
    ];
    this.collectionLoadSequence = [
        Administrators,
        Interests,
        Skills,
        Tools,
        Challenges,
        Developers,
        Teams,
        SlackUsers,
    ];
    this.collectionAssociation = {};
    _.each(this.collections, (collection) => {
      this.collectionAssociation[collection.getCollectionName()] = collection;
    });
  }

  getCollection(collectionName) {
    const collection = this.collectionAssociation[collectionName];
    if (!collection) {
      throw new Meteor.Error(`Called HACCHui.getCollection with unknown collection name: ${collectionName}`);
    }
    return collection;

  }
}

export const HACCHui = new HACCHuiClass();
