import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import CreateProfileWidget from '../../components/participant/CreateProfileWidget';

class CreateProfilePage extends React.Component {
  render() {
    return (
        <CreateProfileWidget />
    );
  }
}

export default withAllSubscriptions(CreateProfilePage);
