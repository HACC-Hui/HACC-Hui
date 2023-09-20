import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ManageHaccWidget from '../../components/administrator/ManageHaccWidget';

const ConfigureHaccPage = () => {
    return (
        <ManageHaccWidget />
        );
}

export default withAllSubscriptions(ConfigureHaccPage);
