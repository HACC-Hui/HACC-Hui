import { _ } from 'meteor/underscore';
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

class HACCHuiClass {
  constructor() {
    this.collections = [
        Challenges,
        ChallengeInterests,
        Developers,
        DeveloperChallenges,
        DeveloperInterests,
        DeveloperSkills,
        DeveloperTools,
        Interests,
        Skills,
        Slugs,
        Teams,
        TeamChallenges,
        TeamDevelopers,
        TeamSkills,
        TeamTools,
        Tools,
    ];
    this.collectionLoadSequence = [
        Interests,
        Skills,
        Tools,
        Challenges,
        Teams,
    ];
    this.collectionAssociation = {};
    _.each(this.collections, (collection) => {
      this.collectionAssociation[collection.getCollectionName()] = collection;
    });
  }

  getCollection(collectionName) {
    const collection = this.collectionAssociation[collectionName];
    if (!collection) {
      throw new Meteor.Error(`Called RadGrad.getCollection with unknown collection name: ${collectionName}`);
    }
    return collection;

  }
}

export const HACCHui = new HACCHuiClass();
