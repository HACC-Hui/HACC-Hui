import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListTeamsWidget from '../../components/developer/ListTeamsWidget';

class ListTeamsPage extends React.Component {
  render() {
    return (
        <ListTeamsWidget />
    );
  }
}

export default withAllSubscriptions(ListTeamsPage);
