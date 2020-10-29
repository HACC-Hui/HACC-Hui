import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import InterestedParticipants from '../../components/participant/InterestedParticipants';

class InterestedParticipantPage extends React.Component {
  render() {
    return (
        <InterestedParticipants />
    );
  }
}

export default withAllSubscriptions(InterestedParticipantPage);
