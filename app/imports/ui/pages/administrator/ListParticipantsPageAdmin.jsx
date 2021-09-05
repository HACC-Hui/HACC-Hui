import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListDevelopersWidgetAdmin from '../../components/administrator/ListParticipantsWidgetAdmin';

class ListParticipantsPageAdmin extends React.Component {
  render() {
    return (
        <ListDevelopersWidgetAdmin />
    );
  }
}

export default withAllSubscriptions(ListParticipantsPageAdmin);
