import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ManageMinorWidget from '../../components/administrator/ManageMinorWidget';
import ManageHaccWidget from '../../components/administrator/ManageHaccWidget';

class ShowMinorPage extends React.Component {
  render() {
    return (
        <ManageMinorWidget />
        );
  }
}

export default withAllSubscriptions(ShowMinorPage);