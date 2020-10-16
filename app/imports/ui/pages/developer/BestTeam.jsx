import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Header, Loader, Grid, Dropdown } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { DeveloperChallenges } from '../../../api/user/DeveloperChallengeCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { DeveloperSkills } from '../../../api/user/DeveloperSkillCollection';
import ListTeamsWidget from '../../components/developer/ListTeamsWidget';
import { DeveloperTools } from '../../../api/user/DeveloperToolCollection';

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
    return Developers._collection.findOne({ username: Meteor.user().username });
  }

  getAllOpenTeam() {

    const teams = Teams._collection.find({ open: true }).fetch();

    console.log(teams);

    return teams;
    // console.log(this.AllOpenTeam);
  }

  getTeamChallenge_priority() {
    const Did = this.getDeveloper()._id;
    const Dchallenges = DeveloperChallenges._collection.find({ developerID: Did }).fetch();
    // const AllTeams = this.getAllOpenTeam();
    const Tchallenges = TeamChallenges._collection.find({}).fetch();
    const challengeTeams = this.getinit_team_priority();
    _.each(Dchallenges, function (Dchallenge) {
 const filterChallTeams = _.filter(Tchallenges,
        function (Tchallenge) { return Tchallenge.challengeID == Dchallenge.challengeID; });
    console.log(filterChallTeams); _.each(filterChallTeams, function (team) { const teamIndex = challengeTeams.findIndex(pteam => pteam._id == team.teamID); challengeTeams[teamIndex].priority += Tools.count() + Skills.count() +1; });
}, challengeTeams);
    this.challenge_priority = challengeTeams;
    const sortTeams = _.sortBy(challengeTeams, 'priority').reverse();
    return sortTeams;

  }

  getTeamSkill_priority() {
    const Did = this.getDeveloper()._id;
    const Dskills = DeveloperSkills._collection.find({ developerID: Did }).fetch();
    // const AllTeams = this.getAllOpenTeam();
    const Tskills = TeamSkills._collection.find({}).fetch();

    const skillsTeams = this.getinit_team_priority();
    _.each(Dskills, function (Dskill) {
      const filterSkillTeams = _.filter(Tskills,
          function (Tskill) { return Tskill.skillID == Dskill.skillID; });
      console.log(filterSkillTeams); _.each(filterSkillTeams, function (team) { const teamIndex = skillsTeams.findIndex(pteam => pteam._id == team.teamID); skillsTeams[teamIndex].priority++; });
    }, skillsTeams);
    this.skill_priority = skillsTeams;
    const sortSkillsTeams = _.sortBy(skillsTeams, 'priority').reverse();
    return sortSkillsTeams;

  }

  getTeamTool_priority() {
    const Did = this.getDeveloper()._id;
    const Dtools = DeveloperTools._collection.find({ developerID: Did }).fetch();
    console.log(Dtools, Did);
    // const AllTeams = this.getAllOpenTeam();
    const Ttools = TeamTools._collection.find({}).fetch();

    const ToolsTeams = this.getinit_team_priority();
    _.each(Dtools, function (Dtool) {
      const filterToolsTeams = _.filter(Ttools,
          function (Ttool) { return Ttool.toolID == Dtool.toolID; });
      console.log(filterToolsTeams); _.each(filterToolsTeams, function (team) { const teamIndex = ToolsTeams.findIndex(pteam => pteam._id == team.teamID); ToolsTeams[teamIndex].priority++; });
    }, ToolsTeams);
    this.tool_priority = ToolsTeams;
    const sortToolsTeams = _.sortBy(ToolsTeams, 'priority').reverse();
    return sortToolsTeams;

  }

  getinit_team_priority() {
     const allteams = this.getAllOpenTeam();
     console.log(allteams);
     const init_team_priority = [];
     _.each(allteams, function (Team) {
 const temp_team_init = {}; temp_team_init._id = Team._id;
     temp_team_init.priority = 0; init_team_priority.push(temp_team_init);
  }, init_team_priority);
     return init_team_priority;

}
  renderBest(){
    this.getTeamChallenge_priority();
    this.getTeamSkill_priority();
    this.getTeamTool_priority();
    const SumPriority = (array1, array2) => {
      // eslint-disable-next-line eqeqeq
      var sumarray = [];
      for(let i =0; i<array1.length; i++)
      {
        const team = {}
        team._id = array1[i]._id;
        team.priority = array1[i].priority + array2[i].priority;
        sumarray.push(team);

      }
      return sumarray;
        }

    ;
    let bestfitTeams = [];
      console.log(SumPriority(this.tool_priority,this.challenge_priority));
    bestfitTeams = SumPriority(this.tool_priority,this.challenge_priority);
    bestfitTeams = SumPriority(this.skill_priority,bestfitTeams);
    bestfitTeams = _.sortBy(bestfitTeams, 'priority').reverse();
    return <div>
      <ListTeamsWidget teams={bestfitTeams}/>
    </div>;

  }
  renderAToZ() {
    const allteams = this.getAllOpenTeam();
    console.log(allteams);
    const sortAToZTeams = _.sortBy(allteams, function (i) { return i.name.toLowerCase(); });
    return <div>
      <ListTeamsWidget teams={sortAToZTeams}/>
    </div>;
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
    console.log(TeamTool);
    return <div>
      <ListTeamsWidget teams={TeamTool}/>
    </div>;
  }

  renderTeamSelected() {
    switch (this.state.select){
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
      // eslint-disable-next-line eqeqeq
        console.log(data);
        const newState = { select: data.value };
        this.setState(newState);

      };
    const options = [
      { key: 0, text: 'default (sort by challenge match)', value: 'default' },
      { key: 1, text: 'sort by best fit teams', value: 'best' },
      { key: 2, text: 'sort by skill match', value: 'skill' },
      { key: 3, text: 'sort by tool match', value: 'tool' },
      { key: 4, text: 'sort by name A to Z', value: 'AToZ' },
    ];
    return <div>
      <Header as='h3'>Please select a filter to sort the matched teams</Header>
      <Dropdown style={{ fontSize:20+'px' }} options={options} onChange={_select} placeholder="Select an option to reorder the team" />
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
  const subscriptionDevelopers = Developers.subscribe();
  const subscriptionTeams = Teams.subscribe();
  const subscriptionDeveloperChallenges = DeveloperChallenges.subscribe();
  const subscriptionTeamChallenges = TeamChallenges.subscribe();
  const subscriptionDeveloperSkill = DeveloperSkills.subscribe();
  const subscriptionDeveloperTools = DeveloperTools.subscribe();
  const subscriptionTeamSkill = TeamSkills.subscribe();
  const subscriptionTeamTool = TeamTools.subscribe();

  return {
    challenges: Challenges.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    developers: Developers.find({}).fetch(),
    teams: Teams.find({}).fetch(),
    developerSkill: DeveloperSkills.find({}).fetch(),
    teamSkills: TeamSkills.find({}).fetch(),
    // eslint-disable-next-line max-len
    ready: subscriptionChallenges.ready() && subscriptionSkills.ready() && subscriptionTools.ready() && subscriptionDevelopers.ready() && subscriptionTeams.ready() && subscriptionDeveloperChallenges.ready() && subscriptionTeamChallenges.ready() && subscriptionDeveloperSkill.ready() && subscriptionTeamSkill.ready() && subscriptionTeamTool.ready() && subscriptionDeveloperTools.ready(),
  };
})(BestTeam);
