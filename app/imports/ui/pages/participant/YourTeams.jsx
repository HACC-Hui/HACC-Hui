import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import YourTeamsWidget from '../../components/participant/YourTeamsWidget';

class YourTeams extends React.Component {
  render() {
    return (
        <YourTeamsWidget />
    );
  }
}

export default withAllSubscriptions(YourTeams);
