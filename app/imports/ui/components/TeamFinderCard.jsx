import React from 'react';
import { Card, Image, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/**
 * Layout for each team
 * @memberOf ui/pages
 */
class TeamFinderCard extends React.Component {

  /** Team Card. */
  render() {
    return (
        <Card className={'teamFinder'} style={{ borderRadius: '20%' }}>
          <Image src={this.props.teams.image} wrapped ui={false}/>
          <Card.Content>
            <Card.Header>{this.props.teams.name}</Card.Header>
            <Card.Meta>
              <span className='date'>{this.props.teams.open}</span>
            </Card.Meta>
            <Card.Description>
              {this.props.teams.description}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            testy
          </Card.Content>
        </Card>
    );
  }
}

// Require an array of Stuff documents in the props.
TeamFinderCard.propTypes = {
  teams: PropTypes.array.isRequired,
};

export default TeamFinderCard;
