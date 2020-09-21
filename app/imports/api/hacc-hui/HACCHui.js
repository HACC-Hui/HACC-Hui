import _ from 'lodash';
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
import { WantsToJoin } from '../team/WantToJoinCollection';

/** @namespace api/hacc-hui */

/**
 * Wrapper class for all the HACC-Hui collections.
 * @memberOf api/hacc-hui
 */
class HACCHuiClass {
  constructor() {
    /** Holds all the collections. */
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
        WantsToJoin,
    ];
    /** The load sequence for loading fixtures. */
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
    /** Maps collection name to the collection. */
    this.collectionAssociation = {};
    _.forEach(this.collections, (collection) => {
      this.collectionAssociation[collection.getCollectionName()] = collection;
    });
  }

  /**
   * Returns the collection for the given collectionName.
   * @param collectionName {string} the name of the collection.
   * @throws {Meteor.Error} if the collectionName is not a HACC-Hui collection name.
   * @return {*}
   */
  getCollection(collectionName) {
    const collection = this.collectionAssociation[collectionName];
    if (!collection) {
      throw new Meteor.Error(`Called HACCHui.getCollection with unknown collection name: ${collectionName}`);
    }
    return collection;
  }
}

/**
 * Singleton instance of the HACCHuiClass.
 * @type {api/hacc-hui.HACCHuiClass}
 * @memberOf api/hacc-hui
 */
export const HACCHui = new HACCHuiClass();
