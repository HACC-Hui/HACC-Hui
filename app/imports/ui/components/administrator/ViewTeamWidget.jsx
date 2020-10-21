import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Grid, Header } from 'semantic-ui-react';
import { Teams } from '../../../api/team/TeamCollection';
import ViewTeamExampleWidget from './ViewTeamExampleWidget';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';

const getTeamMembers = (team) => {
  const teamID = team._id;
  const teamParticipants = TeamParticipants.find({ teamID }).fetch();
  const memberNames = teamParticipants.map((tp) => Participants.getFullName(tp.participantID));
  return memberNames;
};

class ViewTeamWidget extends React.Component {
  render() {
    return (
        <Grid container centered>
          <Grid.Column>
            <div style={{
              backgroundColor: '#E5F0FE', padding: '1rem 0rem', margin: '2rem 0rem',
              borderRadius: '2rem',
            }}>
              <Header as="h2" textAlign="center">View Teams</Header>
            </div>
            <Grid celled>
              <Grid.Row columns={4} style={{
                backgroundColor: '#E5F0FE',}}>
                <Grid.Column>
                  <Header>Team Name</Header>
                </Grid.Column>
                <Grid.Column>
                  <Header>Members</Header>
                </Grid.Column>
                <Grid.Column>
                  <Header>Is the Team Compliant?</Header>
                </Grid.Column>
                <Grid.Column>
                  <Header>Edit Team</Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
              {this.props.teams.map((team) => (
                  <ViewTeamExampleWidget key={team._id}
                                         team={team}
                                         teamMembers={getTeamMembers(team)}
                  />
              ))}
          </Grid.Column>
        </Grid>
    );
  }
}

ViewTeamWidget.propTypes = {
  teams: PropTypes.arrayOf(
      PropTypes.object,
  ),
};

export default withTracker(() => {
  const teams = Teams.find({}).fetch();
  return {
    teams,
  };
})(ViewTeamWidget);
