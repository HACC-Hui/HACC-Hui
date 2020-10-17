import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListSuggestionsWidget from '../../components/administrator/ListSuggestionsWidget';

class ListSuggestions extends React.Component {
  render() {
    return (
        <ListSuggestionsWidget />
    );
  }
}

export default withAllSubscriptions(ListSuggestions);
