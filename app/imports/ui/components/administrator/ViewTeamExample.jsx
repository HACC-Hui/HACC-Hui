import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, List, Button } from 'semantic-ui-react';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';

const ViewTeamExample = ({ isCompliant, participants, teamChallenges, team, teamMembers }) => {
  const allParticipants = participants;

  const captain = allParticipants.filter(p => team.owner === p._id)[0];
  // console.log(team, captain);
  return (
    <Grid celled>
      <Grid.Row columns={4}>
        <Grid.Column>
          <Header>{team.name}</Header>
          <List>
            {teamChallenges.map((c) => <List.Item key={c._id}>{c.title}</List.Item>)}
          </List>
          <Header as="h4">Captain</Header>
          {captain ? `${captain.firstName} ${captain.lastName}: ${captain.username}` : ''}
        </Grid.Column>
        <Grid.Column>
          <List bulleted>
            {teamMembers.map((t) => <List.Item key={t}>{t}</List.Item>)}
          </List>
        </Grid.Column>
        <Grid.Column>
          {isCompliant ? <Header>Team is Compliant</Header> : <Header>
            <mark>Team is not Compliant</mark>
          </Header>}
          <Header>Devpost Page</Header>
          {team.devPostPage}
          <Header>Github Repo</Header>
          {team.gitHubRepo}
        </Grid.Column>
        <Grid.Column>
          {/* eslint-disable-next-line max-len */}
          <Button><Link to={`/admin-edit-team/${team._id}`} style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Edit</Link></Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

ViewTeamExample.propTypes = {
  team: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired,
  teamParticipants: PropTypes.arrayOf(PropTypes.object).isRequired,
  teamMembers: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  teamChallenges: PropTypes.arrayOf(PropTypes.object).isRequired,
  isCompliant: PropTypes.bool.isRequired,
};

export default withTracker((props) => {
  // console.log(props);
  const participants = Participants.find({}).fetch();
  const teamChallenges = _.map(TeamChallenges.find({ teamID: props.team._id }).fetch(),
    (tc) => Challenges.findDoc(tc.challengeID));
  const teamParticipants = TeamParticipants.find({}).fetch();
  return {
    participants,
    teamChallenges,
    teamParticipants,
  };
})(ViewTeamExample);
