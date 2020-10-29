import React from 'react';
import {
  Header,
  Item,
  Button,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';

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

  addSuggestion(type, name, description, instance) {
    let collectionName;
    console.log(type, name, description);
    if (type.toLowerCase() === 'skill') {
      collectionName = Skills.getCollectionName();
    } else if (type.toLowerCase() === 'tool') {
      collectionName = Tools.getCollectionName();
    } else {
      swal('Error', 'Undefined type of suggestion', 'error');
      return false;
    }
    const definitionData = {
      name,
      description,
    };
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        swal('Error defining', error.message, 'error');
      }
      collectionName = Suggestions.getCollectionName();
      removeItMethod.call({ collectionName, instance }, (err) => {
        if (err) {
          swal('Error removing', err.message, 'error');
        }
      });
    });
    return true;
  }

  render() {
    // console.log(this.props);
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
              <Button positive onClick={() => this.addSuggestion(this.props.type,
                  this.props.name, this.props.description, this.props.suggestionObj._id)}>Add Suggestion</Button>
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
