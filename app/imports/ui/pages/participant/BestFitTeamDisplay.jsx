import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Grid, Dropdown } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import ListTeamsWidget from '../../components/participant/ListTeamsWidget';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import ListTeamsDefaultWidget from '../../components/participant/ListTeamsDefaultWidget';

/** Renders a table containing all of the Book documents. Use <BookItem> to render each row. */
class BestTeam extends React.Component {

  challenge_priority;

  skill_priority;

  tool_priority;

  AllopenTeam;

  constructor(props) {
    super(props);
    this.AllopenTeam = [];
    this.challenge_priority = [];
    this.skill_priority = [];
    this.tool_priority = [];
    this.state = { select: 'default' };
  }

  getDeveloper() {
    return Participants._collection.findOne({ username: Meteor.user().username });
  }

  getAllOpenTeam() {

    const teams = Teams._collection.find({ open: true }).fetch();

    return teams;
    // console.log(this.AllOpenTeam);
  }

  getTeamChallenge_priority() {
    const Did = this.getDeveloper()._id;
    const Dchallenges = ParticipantChallenges._collection.find({ participantID: Did }).fetch();
    // const AllTeams = this.getAllOpenTeam();
    const Tchallenges = TeamChallenges._collection.find({}).fetch();
    const challengeTeams = this.getinit_team_priority();
    _.each(Dchallenges, function (Dchallenge) {
      const filterChallTeams = _.filter(Tchallenges,
          // eslint-disable-next-line eqeqeq
          function (Tchallenge) { return Tchallenge.challengeID == Dchallenge.challengeID; });
      _.each(filterChallTeams, function (team) {
        // eslint-disable-next-line eqeqeq
        const teamIndex = challengeTeams.findIndex(pteam => pteam._id == team.teamID);
        challengeTeams[teamIndex].priority += Tools.count() + Skills.count() + 1;
      });
    }, challengeTeams);
    this.challenge_priority = challengeTeams;
    const sortTeams = _.sortBy(challengeTeams, 'priority').reverse();
    return sortTeams;

  }

  getTeamSkill_priority() {
    const Did = this.getDeveloper()._id;
    const Dskills = ParticipantSkills._collection.find({ participantID: Did }).fetch();
    // const AllTeams = this.getAllOpenTeam();
    const Tskills = TeamSkills._collection.find({}).fetch();

    const skillsTeams = this.getinit_team_priority();
    _.each(Dskills, function (Dskill) {
      const filterSkillTeams = _.filter(Tskills,
          // eslint-disable-next-line eqeqeq
          function (Tskill) { return Tskill.skillID == Dskill.skillID; });
      _.each(filterSkillTeams, function (team) {
        // eslint-disable-next-line eqeqeq
        const teamIndex = skillsTeams.findIndex(pteam => pteam._id == team.teamID);
        skillsTeams[teamIndex].priority++;
      });
    }, skillsTeams);
    this.skill_priority = skillsTeams;
    const sortSkillsTeams = _.sortBy(skillsTeams, 'priority').reverse();
    return sortSkillsTeams;

  }

  getTeamTool_priority() {
    const Did = this.getDeveloper()._id;
    const Dtools = ParticipantTools._collection.find({ participantID: Did }).fetch();

    // const AllTeams = this.getAllOpenTeam();
    const Ttools = TeamTools._collection.find({}).fetch();

    const ToolsTeams = this.getinit_team_priority();
    _.each(Dtools, function (Dtool) {
      const filterToolsTeams = _.filter(Ttools,
          // eslint-disable-next-line eqeqeq
          function (Ttool) { return Ttool.toolID == Dtool.toolID; });
      _.each(filterToolsTeams, function (team) {
        // eslint-disable-next-line eqeqeq
        const teamIndex = ToolsTeams.findIndex(pteam => pteam._id == team.teamID);
        ToolsTeams[teamIndex].priority++;
      });
    }, ToolsTeams);
    this.tool_priority = ToolsTeams;
    const sortToolsTeams = _.sortBy(ToolsTeams, 'priority').reverse();
    return sortToolsTeams;

  }

  getinit_team_priority() {
    const allteams = this.getAllOpenTeam();
    const init_team_priority = [];
    _.each(allteams, function (Team) {
      const temp_team_init = {}; temp_team_init._id = Team._id;
      temp_team_init.priority = 0; init_team_priority.push(temp_team_init);
    }, init_team_priority);
    return init_team_priority;

  }

  renderBest() {
    this.getTeamChallenge_priority();
    this.getTeamSkill_priority();
    this.getTeamTool_priority();
    const SumPriority = (array1, array2) => {
      // eslint-disable-next-line eqeqeq
      const sumarray = [];
      for (let i = 0; i < array1.length; i++) {
        const team = {};
        team._id = array1[i]._id;
        team.priority = array1[i].priority + array2[i].priority;
        sumarray.push(team);

      }
      return sumarray;
    };
    let bestfitTeams = [];
    bestfitTeams = SumPriority(this.tool_priority, this.challenge_priority);
    bestfitTeams = SumPriority(this.skill_priority, bestfitTeams);
    bestfitTeams = _.sortBy(bestfitTeams, 'priority').reverse();
    return <div>
      <ListTeamsWidget teams={bestfitTeams}/>
    </div>;

  }

  renderAToZ() {
    const allteams = this.getAllOpenTeam();
    const sortAToZTeams = _.sortBy(allteams, function (i) { return i.name.toLowerCase(); });
    return (<div>
      <ListTeamsDefaultWidget  teams={sortAToZTeams}/>
    </div>);
  }

  renderTeamChallenge_priority() {
    const TeamChallenge = this.getTeamChallenge_priority();
    return <div>
      <ListTeamsWidget teams={TeamChallenge}/>
    </div>;
  }

  renderTeamSkill_priority() {
    const TeamSkill = this.getTeamSkill_priority();
    return <div>
      <ListTeamsWidget teams={TeamSkill}/>
    </div>;
  }

  renderTeamTool_priority() {
    const TeamTool = this.getTeamTool_priority();
    return <div>
      <ListTeamsWidget teams={TeamTool}/>
    </div>;
  }

  renderTeamSelected() {
    switch (this.state.select) {
      case 'skill':
        return this.renderTeamSkill_priority();

      case 'tool':
        return this.renderTeamTool_priority();

      case 'AToZ':
        return this.renderAToZ();
      case 'best':
        return this.renderBest();
      default:
        return this.renderTeamChallenge_priority();
    }

  }

  renderDropDown() {
    const _select = (e, data) => {
      const newState = { select: data.value };
      this.setState(newState);
    };
    const options = [
      { key: 0, text: 'sort the teams by the challenges that match your challenges', value: 'default' },
      { key: 1, text: 'sort by best fit teams', value: 'best' },
      { key: 2, text: 'sort the teams by the skills that match your skills', value: 'skill' },
      { key: 3, text: 'sort the teams by the tools that match your tools', value: 'tool' },
      { key: 4, text: 'sort the teams by the name in alphabet order', value: 'AToZ' },
    ];
    return <div>
      <Grid columns={2}>
        <Grid.Column width={7}>
          <Header>Please select a filter to reorder the teams: </Header>
        </Grid.Column>
        <Grid.Column >
          <Dropdown style={{ fontSize: `${20}px`, width: `${600}px` }} options={options} onChange={_select}
                    placeholder="Select an option to reorder the team" />
        </Grid.Column>
      </Grid>
    </div>;
  }

  render() {

    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {

    return (
        <div>
          <Container>

            <Header as="h1" textAlign="center">Browse for Teams</Header>
            {this.renderDropDown()}
            {this.renderTeamSelected()}
          </Container>
        </div>
    );
  }
}
/** Require an array of Book documents in the props. */
BestTeam.propTypes = {
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  developers: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  developerSkill: PropTypes.array.isRequired,
  teamSkills: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,

};

export default withTracker(() => {
  const subscriptionChallenges = Challenges.subscribe();
  const subscriptionSkills = Skills.subscribe();
  const subscriptionTools = Tools.subscribe();
  const subscriptionDevelopers = Participants.subscribe();
  const subscriptionTeams = Teams.subscribe();
  const subscriptionDeveloperChallenges = ParticipantChallenges.subscribe();
  const subscriptionTeamChallenges = TeamChallenges.subscribe();
  const subscriptionDeveloperSkill = ParticipantSkills.subscribe();
  const subscriptionDeveloperTools = ParticipantTools.subscribe();
  const subscriptionTeamSkill = TeamSkills.subscribe();
  const subscriptionTeamTool = TeamTools.subscribe();

  return {
    challenges: Challenges.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    developers: Participants.find({}).fetch(),
    teams: Teams.find({}).fetch(),
    developerSkill: ParticipantSkills.find({}).fetch(),
    teamSkills: TeamSkills.find({}).fetch(),
    // eslint-disable-next-line max-len
    ready: subscriptionChallenges.ready() && subscriptionSkills.ready() && subscriptionTools.ready() && subscriptionDevelopers.ready() && subscriptionTeams.ready() && subscriptionDeveloperChallenges.ready() && subscriptionTeamChallenges.ready() && subscriptionDeveloperSkill.ready() && subscriptionTeamSkill.ready() && subscriptionTeamTool.ready() && subscriptionDeveloperTools.ready(),
  };
})(BestTeam);
