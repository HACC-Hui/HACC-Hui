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

class ViewTeamExampleWidget extends React.Component {
  render() {
    const allParticipants = this.props.participants;
    function getTeamParticipants(teamID, teamParticipants) {
      const data = [];
      const participants = _.filter(teamParticipants, { teamID: teamID });
      for (let i = 0; i < participants.length; i++) {
        for (let j = 0; j < allParticipants.length; j++) {
          if (participants[i].participantID === allParticipants[j]._id) {
            data.push({
              compliant: allParticipants[j].isCompliant,
            });
          }
        }
      }
      return data;
    }

    return (
        <Grid celled>
          <Grid.Row columns={4}>
            <Grid.Column>
              <Header>{this.props.team.name}</Header>
              <List>
                {this.props.teamChallenges.map((c) => <List.Item key={c._id}>{c.title}</List.Item>)}
              </List>
            </Grid.Column>
            <Grid.Column>
              <List bulleted>
                {this.props.teamMembers.map((t) => <List.Item key={t}>{t}</List.Item>)}
              </List>
            </Grid.Column>
            <Grid.Column>
              { (_.every(getTeamParticipants(this.props.team._id, this.props.teamParticipants),
                  function (value) { return (value.compliant !== false); }))
                  ? <Header>Team is Compliant</Header> : <Header><mark>Team is not Compliant</mark></Header> }
              <Header>Devpost Page</Header>
              {this.props.team.devPostPage}
              <Header>Github Repo</Header>
              {this.props.team.gitHubRepo}
            </Grid.Column>
            <Grid.Column>
              {/* eslint-disable-next-line max-len */}
              <Button><Link to={`/admin-edit-team/${this.props.team._id}`} style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Edit</Link></Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
    );
  }
}

ViewTeamExampleWidget.propTypes = {
  team: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired,
  teamParticipants: PropTypes.arrayOf(PropTypes.object).isRequired,
  teamMembers: PropTypes.arrayOf(
      PropTypes.string,
  ).isRequired,
  teamChallenges: PropTypes.arrayOf(PropTypes.object).isRequired,
  // teamCompliance: PropTypes.arrayOf(
  //     PropTypes.boolean,
  // ).isRequired,
};

export default withTracker((props) => {
  // console.log(props);
  const participants = Participants.find({}).fetch();
  const teamChallenges = _.map(TeamChallenges.find({ teamID: props.team._id }).fetch(),
      (tc) => Challenges.findDoc(tc.challengeID));
  return {
    participants,
    teamChallenges,
    teamParticipants: TeamParticipants.find({}).fetch(),
  };
})(ViewTeamExampleWidget);
