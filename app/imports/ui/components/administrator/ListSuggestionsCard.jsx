import React from 'react';
import {
  Header,
  Item,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';

class ListSuggestionsCard extends React.Component {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
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
            </Item.Content>
        </Item>
    );
  }
}

ListSuggestionsCard.propTypes = {
  key: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
export default withTracker(() => ({
    teamInvitation: TeamInvitations.find({}).fetch(),
  }))(ListSuggestionsCard);
