import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Grid, Header, Container, Checkbox } from 'semantic-ui-react';
import { Teams } from '../../../api/team/TeamCollection';
import ListTeamExampleWidget from './ListTeamExampleWidget';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { Tools } from '../../../api/tool/ToolCollection';

const getTeamChallenges = (team) => {
  const teamID = team._id;
  const teamChallengeDocs = TeamChallenges.find({ teamID }).fetch();
  const challengeTitles = teamChallengeDocs.map((tc) => Challenges.findDoc(tc.challengeID).title);
  return challengeTitles;
};

const getTeamSkills = (team) => {
  const teamID = team._id;
  const teamSkills = TeamSkills.find({ teamID }).fetch();
  const skillNames = teamSkills.map((ts) => Skills.findDoc(ts.skillID).name);
  return skillNames;
};

const getTeamTools = (team) => {
  const teamID = team._id;
  const teamTools = TeamTools.find({ teamID }).fetch();
  const toolNames = teamTools.map((tt) => Tools.findDoc(tt.toolID).name);
  return toolNames;
};

class ListTeamsWidget extends React.Component {

  state = { skills: false, tools: false, challenges: false }

  toggle1 = () => this.setState((prevState) => ({ skills: !prevState.skills }))

  toggle2 = () => this.setState((prevState) => ({ tools: !prevState.tools }))

  toggle3 = () => this.setState((prevState) => ({ challenges: !prevState.challenges }))

  render() {
    return (
      <Container>
          <h2>Sort</h2>
          <Checkbox
                  toggle
                  label='Skills'
                  onChange={this.toggle1}
                  checked={this.state.skills}/>
          <Checkbox
                  fitted
                  toggle
                  label='Tools'
                  onChange={this.toggle2}
                  checked={this.state.tools}/>
          <Checkbox
                  toggle
                  label='Challenges'
                  onChange={this.toggle3}
                  checked={this.state.challenges}/>
        <Grid celled>
          <Grid.Row columns={5}>
            <Grid.Column>
              <Header>Name</Header>
            </Grid.Column>
            <Grid.Column>
              <Header>Challenges</Header>
            </Grid.Column>
            <Grid.Column>
              <Header>Desired Skills</Header>
            </Grid.Column>
            <Grid.Column>
              <Header>Desired Tools</Header>
            </Grid.Column>
            <Grid.Column>
              <Header>Join?</Header>
            </Grid.Column>
          </Grid.Row>
          {this.props.teams.map((team) => (
              <ListTeamExampleWidget key={team._id}
                                     team={team}
                                     teamChallenges={getTeamChallenges(team)}
                                     teamSkills={getTeamSkills(team)}
                                     teamTools={getTeamTools(team)}
              />
          ))}
        </Grid>
        </Container>
    );
  }
}

ListTeamsWidget.propTypes = {
  teams: PropTypes.arrayOf(
      PropTypes.object,
  ),
};

export default withTracker(() => {
  const teams = Teams.find({ open: true }, { sort: ['name', 'asc'] }).fetch();
  console.log(teams);
  return {
    teams,
  };
})(ListTeamsWidget);
