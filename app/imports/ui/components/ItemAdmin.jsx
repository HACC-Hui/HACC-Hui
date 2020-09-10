import React from 'react';
import { Button, Icon, Image, Item, Label, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import BaseSlugCollection from '../../api/base/BaseSlugCollection';
import { slugify } from '../../api/slug/SlugCollection';


function truncate(str, n){
  return (str.length > n) ? str.substr(0, n-1) + '...' : str;
};

/**
 * **Deprecated**
 *
 *  Renders a single row in the List Stuff (Admin) table. See pages/ListStuffAdmin.jsx.
 *  @memberOf ui/components
 */
class ItemAdmin extends React.Component {

  componentDidMount() {
    const {challenge} = this.props;
  }

  render() {
    const {challenge, challengeInterests, challengeDevelopers, challengeTeams} = this.props;
    return (
      <Item>  
        <Item.Content>
          <Item.Header>
            {challenge.title}           
          </Item.Header>
          {/* <Item.Meta>
            <Label as='a' basic color='blue' href={challenge.submissionDetail} target="_blank">
              Submission Details
            </Label>
          </Item.Meta> */}
          <Item.Description>
            {challenge.description}
            <br></br><br></br>
            Submission Details: <a href={challenge.submissionDetail} target="_blank">
                                  {truncate(challenge.submissionDetail, 100)}
                                </a>
            <br></br>
            Pitch: <a href={challenge.pitch} target="_blank">{truncate(challenge.pitch, 100)}</a>
          </Item.Description>
          <Item.Extra>
            {challengeInterests.map((interest) => (
              <Label key={interest._id}>{interest.name}</Label>
            ))}
            <Button color="red" floated='right'>
              <Icon name='delete' />
              Delete
            </Button>
            <Button color="teal" floated='right' as={NavLink} activeClassName="active" exact 
                    to={`/edit/${slugify(challenge.title)}`} key='admin'>
              <Icon name='edit' />
              Edit
            </Button>
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }
}

// Require a document to be passed to this component.
ItemAdmin.propTypes = {
  challenge: PropTypes.object.isRequired,
  challengeInterests: PropTypes.array,
  challengeDevelopers: PropTypes.array,
  challengeTeams: PropTypes.array,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ItemAdmin);
