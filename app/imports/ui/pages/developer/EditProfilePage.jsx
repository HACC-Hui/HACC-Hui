import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import EditProfileWidget from '../../components/developer/EditProfileWidget';

class EditProfilePage extends React.Component {
  render() {
    return (
        <EditProfileWidget />
    );
  }
}

export default withAllSubscriptions(EditProfilePage);
