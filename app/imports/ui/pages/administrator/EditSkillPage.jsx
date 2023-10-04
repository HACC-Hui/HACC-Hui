import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import EditSkillWidget from '../../components/administrator/EditSkillWidget';

class EditToolPage extends React.Component {
  render() {
    return (
        <EditSkillWidget />
    );
  }
}

export default withAllSubscriptions(EditToolPage);
