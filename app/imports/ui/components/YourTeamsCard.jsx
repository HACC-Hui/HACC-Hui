import React from 'react';
import {
  Grid,
  Header,
  Image,
  Item,
  Icon,
  Button, Modal,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { _ } from 'lodash';

class YourTeamsCard extends React.Component {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {

    return (
        <Item style={{ padding: '0rem 2rem 0rem 2rem' }}>
            <Item.Content>
              <Item.Header>
                <Header as={'h3'} style={{ color: '#263763', paddingTop: '2rem' }}>
                  <Icon name='users' size='tiny'/>
                  {this.props.teams.name}
                </Header>
              </Item.Header>
              <Item.Meta>
                  <Grid columns='equal'>
                    <Grid.Column>
                      <Image src={this.props.teams.image} rounded size='large'/>
                    </Grid.Column>
                    <Grid.Column>
                      <Header>Members</Header>
                      {this.props.teamDevelopers.map((developer) => <p key={developer}>
                        {developer.firstName} {developer.lastName}</p>)}
                    </Grid.Column>
                  </Grid>
              </Item.Meta>
            </Item.Content>
                <Button id={this.props.teams._id} style={{ backgroundColor: 'transparent' }}>
                  <Link to={`/interested-developers/${this.props.teams._id}`}>See interested developers</Link>
                </Button>

          <Button id={this.props.teams._id} style={{ backgroundColor: 'transparent' }}>
            <Link to={`/edit-team/${this.props.teams._id}`}>Edit Team</Link>
          </Button>
        </Item>
    );
  }
}

YourTeamsCard.propTypes = {
  teams: PropTypes.object.isRequired,
  teamDevelopers: PropTypes.object.isRequired,
};

export default YourTeamsCard;
