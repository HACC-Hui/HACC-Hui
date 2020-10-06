import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import CreateTeamWidget from '../../components/participant/CreateTeamWidget';

class CreateTeamPage extends React.Component {
  render() {
    return (
        <CreateTeamWidget />
    );
  }
}

export default withAllSubscriptions(CreateTeamPage);
