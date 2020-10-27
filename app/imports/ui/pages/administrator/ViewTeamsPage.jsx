import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ViewTeamsWidget from '../../components/administrator/ViewTeamsWidget';

class ViewTeamsPage extends React.Component {
  render() {
    return (
        <ViewTeamsWidget />
        );
  }
}

export default withAllSubscriptions(ViewTeamsPage);
