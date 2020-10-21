import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ManageHaccWidget from '../../components/administrator/ManageHaccWidget';
import ManageMinorWidget from '../../components/administrator/ManageMinorWidget';

class ConfigureHaccPage extends React.Component {
  render() {
    return (
        <ManageHaccWidget />
        );
  }
}

export default withAllSubscriptions(ConfigureHaccPage);
