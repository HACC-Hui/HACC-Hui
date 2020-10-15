import React from 'react';
import {
  Header,
  Item,
  Button,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';

class ListSuggestionsCard extends React.Component {

  removeItem() {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this suggestion!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          console.log(this.props.suggestionObj);
          if (willDelete) {
            removeItMethod.call({
              collectionName: Suggestions.getCollectionName(),
              instance: this.props.suggestionObj._id,
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Suggestion removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  }

  render() {

    return (
        <Item
              style={{ padding: '0rem 2rem 2rem 2rem' }}>
            <Item.Content>
              <Item.Header>
                <Header as={'h3'} style={{ color: '#263763', paddingTop: '2rem' }}>
                  {this.props.name}
                </Header>
              </Item.Header>
              <Item.Meta>
                {this.props.type}
              </Item.Meta>
              <Item.Description>
                {this.props.description}
              </Item.Description>
              <Item.Extra>Suggested By: {this.props.username} </Item.Extra>
              <Button negative onClick={() => this.removeItem()}>Delete</Button>
            </Item.Content>
        </Item>
    );
  }
}

ListSuggestionsCard.propTypes = {
  type: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  suggestionObj: PropTypes.object.isRequired,
};
export default withTracker(() => ({
    suggestion: Suggestions.find({}).fetch(),
  }))(ListSuggestionsCard);
