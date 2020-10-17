import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListTeamsDefaultWidget from '../../components/participant/ListTeamsDefaultWidget';

class ListTeamsPage extends React.Component {
  render() {
    return (
        <ListTeamsDefaultWidget />
    );
  }
}

export default withAllSubscriptions(ListTeamsPage);
