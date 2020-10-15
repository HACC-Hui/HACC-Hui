import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import AdminEditTeamWidget from '../../components/administrator/AdminEditTeamWidget';

class AdminEditTeamPage extends React.Component {
  render() {
    return (
        <AdminEditTeamWidget />
    );
  }
}

export default withAllSubscriptions(AdminEditTeamPage);
