import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Header, List } from 'semantic-ui-react';
import _ from 'lodash';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import SkillItem from './SkillItem';
import ToolItem from './ToolItem';

class TeamCard extends React.Component {
  buildTheTeam() {
    const { team } = this.props;
    const teamID = team._id;
    const tCs = TeamChallenges.find({ teamID }).fetch();
    const challengeTitles = _.map(tCs, (tc) => Challenges.findDoc(tc.challengeID).title);
    team.challenges = challengeTitles;
    team.skills = TeamSkills.find({ teamID }).fetch();
    team.tools = TeamTools.find({ teamID }).fetch();
    return team;
  }

  render() {
    // console.log(this.props.team);
    const team = this.buildTheTeam();
    // console.log(team);
    return (
        <Card fluid>
          <Card.Content>
            <Card.Header>{team.name}</Card.Header>
            <Card.Description>
              <Grid columns={3}>
                <Grid.Column>
                  <Header size="tiny">Challenges</Header>
                  {team.challenges.join(', ')}
                </Grid.Column>
                <Grid.Column>
                  <Header size="tiny">Desired Skills</Header>
                  <List>
                    {team.skills.map((item) => <SkillItem item={item} key={item._id} />)}
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <Header size="tiny">Desired Tools</Header>
                  <List>
                    {team.tools.map((item) => <ToolItem item={item} key={item._id} />)}
                  </List>
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
};

export default TeamCard;
