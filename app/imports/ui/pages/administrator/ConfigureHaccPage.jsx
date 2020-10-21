import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ManageHaccWidget from '../../components/administrator/ManageHaccWidget';

class ConfigureHaccPage extends React.Component {
  render() {
    return (
        <ManageHaccWidget />
        );
  }
}

export default withAllSubscriptions(ConfigureHaccPage);
