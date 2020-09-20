import React from 'react';
import {
  Grid,
  Header,
  Loader,
  Item,
  Icon,
  Button,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamDevelopers } from '../../../api/team/TeamDeveloperCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import InterestedDeveloperCard from '../../components/InterestedDeveloperCard';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class InterestedDevelopers extends React.Component {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {

    if (this.props.teams.length === 0) {
      return (
          <div align={'center'}>
            <Header as='h2' icon>
              <Icon name='users'/>
              There are no available teams at the moment.
              <Header.Subheader>
                Please check back later.
              </Header.Subheader>
            </Header>
          </div>
      );
    }

    const universalSkills = this.props.skills;

    function getTeamSkills(teamID, teamSkills) {
      const data = [];
      const skills = _.filter(teamSkills, { teamID: teamID });
      for (let i = 0; i < skills.length; i++) {
        for (let j = 0; j < universalSkills.length; j++) {
          if (skills[i].skillID === universalSkills[j]._id) {
            data.push(universalSkills[j].name);
          }
        }
      }
      return data;
    }

    const universalTools = this.props.tools;

    function getTeamTools(teamID, teamTools) {
      const data = [];
      const tools = _.filter(teamTools, { teamID: teamID });
      for (let i = 0; i < tools.length; i++) {
        for (let j = 0; j < universalTools.length; j++) {
          if (tools[i].toolID === universalTools[j]._id) {
            data.push(universalTools[j].name);
          }
        }
      }
      return data;
    }

    const universalChallenges = this.props.challenges;

    function getTeamChallenges(teamID, teamChallenges) {
      const data = [];
      const challenges = _.filter(teamChallenges, { teamID: teamID });
      for (let i = 0; i < challenges.length; i++) {
        for (let j = 0; j < universalChallenges.length; j++) {
          if (challenges[i].challengeID === universalChallenges[j]._id) {
            data.push(universalChallenges[j].title);
          }
        }
      }
      return data;
    }

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

    return (
        <Grid container doubling relaxed stackable>
          <Grid.Row centered>
            <Header as={'h2'} style={{ paddingTop: '2rem' }}>
              Interested Developers
            </Header>
          </Grid.Row>
          <Grid.Row>
          <Grid.Column>
            <Item.Group divided>
              {this.props.teams.map((teams) => <InterestedDeveloperCard key={teams._id} teams={teams}
                   skills={getTeamSkills(teams._id, this.props.teamSkills)}
                   tools={getTeamTools(teams._id, this.props.teamTools)}
                   challenges={getTeamChallenges(teams._id, this.props.teamChallenges)}
                   developers={getTeamDevelopers(teams._id, this.props.teamDevelopers)}
                  />)}
            </Item.Group>
          </Grid.Column>
          </Grid.Row>
        </Grid>
    );
  }
}

InterestedDevelopers.propTypes = {
  teamChallenges: PropTypes.array.isRequired,
  teamSkills: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  teamTools: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  developers: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  teamDevelopers: PropTypes.array.isRequired,

};

export default withTracker(() => {
  const subscriptionChallenges = TeamChallenges.subscribe();
  const subscriptionSkills = TeamSkills.subscribe();
  const subscriptionTools = TeamTools.subscribe();
  const subscriptionDevelopers = Developers.subscribe();
  const subscriptionTeam = Teams.subscribe();
  const subSkills = Skills.subscribe();
  const subChallenges = Challenges.subscribe();
  const subTools = Tools.subscribe();
  const teamDev = TeamDevelopers.subscribe();

  return {
    teamChallenges: TeamChallenges.find({}).fetch(),
    teamSkills: TeamSkills.find({}).fetch(),
    teamTools: TeamTools.find({}).fetch(),
    teams: Teams.find({ open: true }).fetch(),
    skills: Skills.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    developers: Developers.find({}).fetch(),
    teamDevelopers: TeamDevelopers.find({}).fetch(),
    // eslint-disable-next-line max-len
    ready: subscriptionChallenges.ready() && subscriptionSkills.ready() && subscriptionTools.ready()
        && subscriptionDevelopers.ready() && subscriptionTeam.ready() && subSkills.ready() && subTools.ready()
        && subChallenges.ready() && teamDev.ready(),
  };
})(InterestedDevelopers);
