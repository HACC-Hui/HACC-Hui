import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ViewTeams from '../../components/administrator/ViewTeams';
 function ViewTeamsPage() {
    return (
      <ViewTeams />
    );
  }

export default withAllSubscriptions(ViewTeamsPage);
