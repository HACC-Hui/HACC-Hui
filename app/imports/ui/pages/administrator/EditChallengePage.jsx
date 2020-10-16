import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import EditChallengeWidget from '../../components/administrator/EditChallengeWidget';

class EditChallengePage extends React.Component {
  render() {
    return (
        <EditChallengeWidget />
    );
  }
}

export default withAllSubscriptions(EditChallengePage);
