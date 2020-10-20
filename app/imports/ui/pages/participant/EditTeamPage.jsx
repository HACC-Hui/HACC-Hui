import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import EditTeamWidget from '../../components/participant/EditTeamWidget';

class EditTeamPage extends React.Component {
  render() {
    return (
        <EditTeamWidget />
    );
  }
}

export default withAllSubscriptions(EditTeamPage);
