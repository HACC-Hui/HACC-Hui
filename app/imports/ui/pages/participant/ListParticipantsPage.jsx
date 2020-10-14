import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListDevelopersWidget from '../../components/participant/ListParticipantsWidget';

class ListParticipantsPage extends React.Component {
  render() {
    return (
        <ListDevelopersWidget />
    );
  }
}

export default withAllSubscriptions(ListParticipantsPage);
