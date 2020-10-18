import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import TeamCreationWidget from '../../components/developer/TeamCreationWidget';

class TeamCreationPage extends React.Component {
  render() {
    return (
        <TeamCreationWidget />
    );
  }
}

export default withAllSubscriptions(TeamCreationPage);
