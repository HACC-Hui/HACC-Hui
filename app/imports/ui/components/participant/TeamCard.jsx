import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Grid, Header, List } from 'semantic-ui-react';
import _ from 'lodash';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import SkillItem from './SkillItem';
import ToolItem from './ToolItem';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';

class TeamCard extends React.Component {
  buildTheTeam() {
    const { team } = this.props;
    const teamID = team._id;
    const tCs = TeamChallenges.find({ teamID }).fetch();
    const challengeTitles = _.map(tCs, (tc) => Challenges.findDoc(tc.challengeID).title);
    team.challenges = challengeTitles;
    team.skills = TeamSkills.find({ teamID }).fetch();
    team.tools = TeamTools.find({ teamID }).fetch();
    const teamPs = TeamParticipants.find({ teamID }).fetch();
    team.members = _.map(teamPs, (tp) => Participants.getFullName(tp.participantID));
    return team;
  }

  render() {
    // console.log(this.props.team);
    const team = this.buildTheTeam();
    // console.log(team);
    const isOwner = team.owner === this.props.participantID;
    return (
        <Card fluid>
          <Card.Content>
            <Card.Header>{team.name}</Card.Header>
            <Card.Description>
              <Grid columns={5}>
                <Grid.Column>
                  <Header size="tiny">Challenges</Header>
                  {team.challenges.join(', ')}
                </Grid.Column>
                <Grid.Column>
                  <Header size="tiny">Desired Skills</Header>
                  <List bulleted>
                    {team.skills.map((item) => <SkillItem item={item} key={item._id} />)}
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <Header size="tiny">Desired Tools</Header>
                  <List bulleted>
                    {team.tools.map((item) => <ToolItem item={item} key={item._id} />)}
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <Header size="tiny">Members</Header>
                  <List>
                    {team.members.map((member, index) => <List.Item key={`${index}${member}`}>{member}</List.Item>)}
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <Button disabled={isOwner} color="red">Leave team</Button>
                </Grid.Column>
              </Grid>
            </Card.Description>
          </Card.Content>
        </Card>
    );
  }
}

TeamCard.propTypes = {
  team: PropTypes.object.isRequired,
  participantID: PropTypes.string.isRequired,
};

export default TeamCard;
