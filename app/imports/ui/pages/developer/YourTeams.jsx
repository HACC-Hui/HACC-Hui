import { Meteor } from 'meteor/meteor';
import React from 'react';
import {
  Grid,
  Header,
  Loader,
  Item,
  Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'lodash';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamDevelopers } from '../../../api/team/TeamDeveloperCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import YourTeamsCard from '../../components/YourTeamsCard';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class YourTeams extends React.Component {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {

    const allDevelopers = this.props.developers;

    function getTeamDevelopers(teamID, teamDevelopers) {
      const data = [];
      const developers = _.filter(teamDevelopers, { teamID: teamID });
      for (let i = 0; i < developers.length; i++) {
        for (let j = 0; j < allDevelopers.length; j++) {
          if (developers[i].developerID === allDevelopers[j]._id) {
            data.push({
              firstName: allDevelopers[j].firstName,
              lastName: allDevelopers[j].lastName,
            });
          }
        }
      }
      return data;
    }

    if (this.props.teams.length === 0) {
      return (
          <div align={'center'}>
            <Header as='h2' icon>
              <Icon name='users'/>
              You are not the owner of any teams
              <Header.Subheader>
                Please check back later.
              </Header.Subheader>
            </Header>
          </div>
      );
    }
    return (
        <Grid container doubling relaxed stackable>
          <Grid.Row centered>
            <Header as={'h2'} style={{ paddingTop: '2rem' }}>
              Your Teams
            </Header>
          </Grid.Row>
          <Grid.Column width={12}>
            <Item.Group divided>
              {/* eslint-disable-next-line max-len */}
              {this.props.teams.map((teams) => <YourTeamsCard key={teams._id} teams={teams} teamDevelopers={getTeamDevelopers(teams._id, this.props.teamDevelopers)}/>)}
            </Item.Group>
          </Grid.Column>
        </Grid>
    );
  }
}

YourTeams.propTypes = {
  teams: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  teamDevelopers: PropTypes.array.isRequired,
  developers: Developers.find({}).fetch(),

};

export default withTracker(() => {
  const subscriptionDevelopers = Developers.subscribe();
  const subscriptionTeam = Teams.subscribe();
  const teamDev = TeamDevelopers.subscribe();

  return {
    teams: Teams.find({ owner: Developers.findDoc({ userID: Meteor.userId() })._id }).fetch(),
    developers: Developers.find({}).fetch(),
    teamDevelopers: TeamDevelopers.find({}).fetch(),
    // eslint-disable-next-line max-len
    ready: subscriptionDevelopers.ready() && subscriptionTeam.ready() && teamDev.ready(),
  };
})(YourTeams);
