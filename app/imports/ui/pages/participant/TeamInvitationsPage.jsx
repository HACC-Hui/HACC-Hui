import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import TeamInvitationsWidget from '../../components/participant/TeamInvitationsWidget';

class TeamInvitationsPage extends React.Component {
  render() {
    return (
        <TeamInvitationsWidget />
    );
  }
}

export default withAllSubscriptions(TeamInvitationsPage);
