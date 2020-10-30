import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import AllTeamInvitationsWidget from '../../components/administrator/AllTeamInvitationsWidget';

class AllTeamInvitationsPage extends React.Component {
  render() {
    return (
        <AllTeamInvitationsWidget />
    );
  }
}

export default withAllSubscriptions(AllTeamInvitationsPage);
