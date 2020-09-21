import React from 'react';
import {
  Grid,
  Header,
  Image,
  Item,
  Icon,
  Button,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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
                <Item.Meta>
                  <Grid>
                    <Grid.Column>
                      <Image src={this.props.teams.image} rounded size='small'/>
                    </Grid.Column>
                  </Grid>
                </Item.Meta>
              </Item.Meta>
            </Item.Content>
                <Button id={this.props.teams._id} style={{ backgroundColor: 'transparent' }}>
                  <Link to={`/interested-developers/${this.props.teams._id}`}>See interested developers</Link>
                </Button>
        </Item>
    );
  }
}

YourTeamsCard.propTypes = {
  teams: PropTypes.object.isRequired,
};

export default YourTeamsCard;
