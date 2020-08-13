import React from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { Loader } from 'semantic-ui-react';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { ChallengeInterests } from '../../api/challenge/ChallengeInterestCollection';
import { Interests } from '../../api/interest/InterestCollection';
import { Skills } from '../../api/skill/SkillCollection';
import { Slugs } from '../../api/slug/SlugCollection';
import { Teams } from '../../api/team/TeamCollection';
import { Tools } from '../../api/tool/ToolCollection';
import { TeamChallenges } from '../../api/team/TeamChallengeCollection';
import { TeamDevelopers } from '../../api/team/TeamDeveloperCollection';
import { TeamSkills } from '../../api/team/TeamSkillCollection';
import { TeamTools } from '../../api/team/TeamToolCollection';
import { Administrators } from '../../api/user/AdministratorCollection';
import { DeveloperChallenges } from '../../api/user/DeveloperChallengeCollection';
import { DeveloperInterests } from '../../api/user/DeveloperInterestCollection';
import { DeveloperTools } from '../../api/user/DeveloperToolCollection';
import { DeveloperSkills } from '../../api/user/DeveloperSkillCollection';
import { Developers } from '../../api/user/DeveloperCollection';

// cacheLimit default is 10, so increased to handle all our subscriptions.
// expireLimit set to 30 minutes because: why not.
const allSubs = new SubsManager({ cacheLimit: 20, expireIn: 30 });

/**
 * Higher order component that waits for the subscriptions.
 * @param WrappedComponent {React.Component} the wrapped component.
 * @return {React.Component} The WrappedComponent with subscriptions.
 * @memberOf ui/layouts
 */
function withAllSubscriptions(WrappedComponent) {
  const AllSubscriptionsHOC = (props) => ((props.loading) ? (
              <Loader active>Getting data.</Loader>
          ) :
          <WrappedComponent {...props} />
  );
  AllSubscriptionsHOC.propTypes = {
    loading: PropTypes.bool,
  };

  return withTracker(() => {
    const handles = [
      allSubs.subscribe(Administrators.getCollectionName()),
      allSubs.subscribe(Challenges.getCollectionName()),
      allSubs.subscribe(ChallengeInterests.getCollectionName()),
      allSubs.subscribe(DeveloperChallenges.getCollectionName()),
      allSubs.subscribe(DeveloperInterests.getCollectionName()),
      allSubs.subscribe(DeveloperSkills.getCollectionName()),
      allSubs.subscribe(Developers.getCollectionName()),
      allSubs.subscribe(DeveloperTools.getCollectionName()),
      allSubs.subscribe(Interests.getCollectionName()),
      allSubs.subscribe(Skills.getCollectionName()),
      allSubs.subscribe(Slugs.getCollectionName()),
      allSubs.subscribe(TeamChallenges.getCollectionName()),
      allSubs.subscribe(TeamDevelopers.getCollectionName()),
      allSubs.subscribe(Teams.getCollectionName()),
      allSubs.subscribe(TeamSkills.getCollectionName()),
      allSubs.subscribe(TeamTools.getCollectionName()),
      allSubs.subscribe(Tools.getCollectionName()),
    ];
    const loading = handles.some((handle) => !handle.ready());
    return {
      loading,
    };

  })(AllSubscriptionsHOC);
}

export default withAllSubscriptions;
