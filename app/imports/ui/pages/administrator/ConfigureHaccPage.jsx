import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ManageHaccWidget from '../../components/administrator/ManageHaccWidget';

const ConfigureHaccPage = () => {
  return (
    <div id="configure-hacc-page" style={{ paddingBottom: '50px' }}>
      <ManageHaccWidget />
    </div>
  );
};

export default withAllSubscriptions(ConfigureHaccPage);
