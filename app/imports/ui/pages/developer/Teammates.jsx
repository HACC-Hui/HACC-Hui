import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import TeammatesWidget from '../../components/developer/TeammatesWidget';

class Teammates extends React.Component {
  render() {
    return (
        <TeammatesWidget />
    );
  }
}

export default withAllSubscriptions(Teammates);
