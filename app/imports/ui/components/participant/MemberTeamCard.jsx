import React from 'react';
import {
  Grid,
  Header,
  Image,
  Item,
  Icon, List,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { Tools } from '../../../api/tool/ToolCollection';

class MemberTeamCard extends React.Component {
  render() {
    const teamID = this.props.team._id;
    const teamChallenges = _.map(TeamChallenges.find({ teamID }).fetch(),
    (tc) => Challenges.findDoc(tc.challengeID).title);
    const teamSkills = _.map(TeamSkills.find({ teamID }).fetch(), (ts) => Skills.findDoc(ts.skillID).name);
    const teamTools = _.map(TeamTools.find({ teamID }).fetch(), (tt) => Tools.findDoc(tt.toolID).name);
    return (
        <Item style={{ padding: '0rem 2rem 0rem 2rem' }}>
          <Item.Content>
            <Item.Header>
              <Header as={'h3'} style={{ color: '#263763', paddingTop: '2rem' }}>
                <Icon name='users' size='tiny' />
                {this.props.team.name}
              </Header>
            </Item.Header>
            <Item.Meta>
              <Grid columns='equal'>
                <Grid.Column>
                  GitHub: {this.props.team.gitHubRepo}<br />
                  DevPost: {this.props.team.devPostPage}
                  <Image src={this.props.team.image} rounded size='large' />
                </Grid.Column>
                <Grid.Column>
                  <Header>Challenges</Header>
                  <List>
                    {teamChallenges.map((skill) => <List.Item key={skill}>{skill}</List.Item>)}
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <Header>Skills</Header>
                  <List>
                    {teamSkills.map((skill) => <List.Item key={skill}>{skill}</List.Item>)}
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <Header>Tools</Header>
                  <List>
                    {teamTools.map((skill) => <List.Item key={skill}>{skill}</List.Item>)}
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <Header>Members</Header>
                  {this.props.teamParticipants.map((participant) => <p key={participant}>
                    {participant.firstName} {participant.lastName}</p>)}
                </Grid.Column>
              </Grid>
            </Item.Meta>
          </Item.Content>
        </Item>
    );
  }
}

MemberTeamCard.propTypes = {
  team: PropTypes.object.isRequired,
  teamParticipants: PropTypes.array.isRequired,
};

export default MemberTeamCard;
