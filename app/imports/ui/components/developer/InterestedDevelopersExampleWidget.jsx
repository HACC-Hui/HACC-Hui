import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Icon, Card } from 'semantic-ui-react';

class InterestedDevelopersExampleWidget extends React.Component {

  render() {
    return (
        <Grid.Row columns={1}>
          <Grid.Column>
            <Card fluid header='Interested User 1'>
              <Card.Content>
                <Card.Header>{this.props.developerName}</Card.Header>
                <Card.Meta>
                  <span className='date'>Skills: {this.props.developerSkills}</span>
                </Card.Meta>
                <Card.Meta>
                  <span className='date'>Tools: {this.props.developerTools}</span>
                </Card.Meta>
                <Card.Meta>
                  <span className='date'>Interests: {this.props.developerInterests}</span>
                </Card.Meta>
                <Card.Meta>
                  <span className='date'>Challenges: {this.props.developerChallenges}</span>
                </Card.Meta>
                <Card.Description>
                  Description: {this.props.developerDescription}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <a>
                  <Icon name='graduation cap' />
                  {this.props.developerEducation}
                </a>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
    );
  }
}

InterestedDevelopersExampleWidget.propTypes = {
  developer: PropTypes.object,
  developerName: PropTypes.string,
  developerSkills: PropTypes.string,
  developerTools: PropTypes.string,
  developerInterests: PropTypes.string,
  developerChallenges: PropTypes.string,
  developerDescription: PropTypes.string,
  developerEducation: PropTypes.string,

};

export default InterestedDevelopersExampleWidget;
