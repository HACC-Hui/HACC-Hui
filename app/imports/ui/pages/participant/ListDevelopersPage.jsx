import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListDevelopersWidget from '../../components/participant/ListDevelopersWidget';

class ListDevelopersPage extends React.Component {
  render() {
    return (
        <ListDevelopersWidget />
    );
  }
}

export default withAllSubscriptions(ListDevelopersPage);
