import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import EditToolWidget from '../../components/administrator/EditToolWidget';

class EditToolPage extends React.Component {
  render() {
    return (
        <EditToolWidget />
    );
  }
}

export default withAllSubscriptions(EditToolPage);
