import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListDevelopersWidget from '../../components/administrator/ListParticipantsWidgetAdmin';

class ListParticipantsPageAdmin extends React.Component {
  render() {
    return (
        <ListDevelopersWidget />
    );
  }
}

export default withAllSubscriptions(ListParticipantsPageAdmin);
