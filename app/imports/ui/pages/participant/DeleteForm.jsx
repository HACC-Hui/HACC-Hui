import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import DeleteFormWidget from '../../components/participant/DeleteFormWidget';

class DeleteForm extends React.Component {
  render() {
    return (
        <DeleteFormWidget/>
    );
  }
}

export default withAllSubscriptions(DeleteForm);
