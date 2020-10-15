import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import SuggestToolSkillWidget from '../../components/participant/SuggestToolSkillWidget';

class SuggestToolSkillPage extends React.Component {
  render() {
    return (
        <SuggestToolSkillWidget />
    );
  }
}

export default withAllSubscriptions(SuggestToolSkillPage);
