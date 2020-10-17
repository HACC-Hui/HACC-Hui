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
import { TeamParticipants } from '../../api/team/TeamParticipantCollection';
import { TeamSkills } from '../../api/team/TeamSkillCollection';
import { TeamTools } from '../../api/team/TeamToolCollection';
import { Administrators } from '../../api/user/AdministratorCollection';
import { ParticipantChallenges } from '../../api/user/ParticipantChallengeCollection';
import { ParticipantInterests } from '../../api/user/ParticipantInterestCollection';
import { ParticipantTools } from '../../api/user/ParticipantToolCollection';
import { ParticipantSkills } from '../../api/user/ParticipantSkillCollection';
import { Participants } from '../../api/user/ParticipantCollection';
import { TeamInvitations } from '../../api/team/TeamInvitationCollection';
import { Suggestions } from '../../api/suggestions/SuggestionCollection';

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
      allSubs.subscribe(ParticipantChallenges.getCollectionName()),
      allSubs.subscribe(ParticipantInterests.getCollectionName()),
      allSubs.subscribe(ParticipantSkills.getCollectionName()),
      allSubs.subscribe(Participants.getCollectionName()),
      allSubs.subscribe(ParticipantTools.getCollectionName()),
      allSubs.subscribe(Interests.getCollectionName()),
      allSubs.subscribe(Skills.getCollectionName()),
      allSubs.subscribe(Slugs.getCollectionName()),
      allSubs.subscribe(TeamChallenges.getCollectionName()),
      allSubs.subscribe(TeamParticipants.getCollectionName()),
      allSubs.subscribe(Teams.getCollectionName()),
      allSubs.subscribe(TeamSkills.getCollectionName()),
      allSubs.subscribe(TeamTools.getCollectionName()),
      allSubs.subscribe(Tools.getCollectionName()),
      allSubs.subscribe(TeamInvitations.getCollectionName()),
      allSubs.subscribe(Suggestions.getCollectionName()),
    ];
    const loading = handles.some((handle) => !handle.ready());
    return {
      loading,
    };

  })(AllSubscriptionsHOC);
}

export default withAllSubscriptions;
