import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ViewTeamWidget from '../../components/administrator/ViewTeamWidget';

class ViewTeamPage extends React.Component {
  render() {
    return (
        <ViewTeamWidget />
        );
  }
}

export default withAllSubscriptions(ViewTeamPage);
