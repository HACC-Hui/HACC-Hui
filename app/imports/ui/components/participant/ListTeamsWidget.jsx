import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Grid, Header } from 'semantic-ui-react';
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
  render() {
    return (
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
    );
  }
}

ListTeamsWidget.propTypes = {
  teams: PropTypes.arrayOf(
      PropTypes.object,
  ),
};

export default withTracker(() => {
  const teams = Teams.find({}).fetch();
  return {
    teams,
  };
})(ListTeamsWidget);
