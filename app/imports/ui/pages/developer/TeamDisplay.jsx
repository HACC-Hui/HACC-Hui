import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Header, Loader, Grid, Button } from 'semantic-ui-react';
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
class TeamDisplay extends React.Component {

  AllOpenTeam;

  Team_challenge_match;

  Team_challenge_skill;

  Team_challenge_tool;

  BestTeam;

  constructor(props) {
    super(props);
    this.AllOpenTeam = [];
    this.Team_challenge_match = [];
    this.Team_challenge_skill = [];
    this.Team_challenge_tool = [];
    this.BestTeam = [];

  }

  getDeveloper() {
    return Developers._collection.findOne({ username: Meteor.user().username });
  }

  getAllOpenTeam() {

    const teams = Teams._collection.find({ open: true }).fetch();
    this.AllOpenTeam = teams;
    console.log(this.AllOpenTeam);
  }

  getTeamChallenge_match() {
    const Did = this.getDeveloper()._id;
    const Dchallenges = DeveloperChallenges._collection.find({ developerID: Did }).fetch();
    const Tchaleenges = TeamChallenges._collection.find({}).fetch();
    const challengeTeams = [];
    console.log(Tchaleenges);
    console.log(Dchallenges);
   _.each(Dchallenges, function (challenge) {
 const tempTeam = {}; tempTeam.challengeID = challenge.challengeID; tempTeam.teams = TeamChallenges._collection.find({ challengeID: challenge.challengeID }).fetch();
   challengeTeams.push(tempTeam); console.log(challengeTeams);
}, challengeTeams);
   const challenge_teams = [];
   const Allchallenges = this.props.challenges;
   const Allteams = this.AllOpenTeam;
  _.each(challengeTeams, function (challengeObject) { const tempChallengeteam = {}; const challengePicked = _.find(Allchallenges, function (challange) { return challange._id == challengeObject.challengeID; }); tempChallengeteam.Challenge = challengePicked.title; const Matchteams = []; _.each(challengeObject.teams, function (Cteam) { const Matchteam = _.find(Allteams, function (team) { return Cteam.teamID == team._id; }); Matchteams.push(Matchteam); }, Allteams); tempChallengeteam.teams = Matchteams; challenge_teams.push(tempChallengeteam); }, Allchallenges);
  this.Team_challenge_match = challenge_teams;
  return challenge_teams;
  }


  renderTeamChallenge_match() {
    const Challenge_matched_teams = this.getTeamChallenge_match();
    return _.map(Challenge_matched_teams, function (chall_team) {
            if (chall_team.teams.length > 0) return <div key={chall_team}><Container><Header as='h3'>The Following teams have your requested Challenge: {chall_team.Challenge}</Header> <ListTeamsWidget teams={chall_team.teams}/></Container></div>;
            return '';
    });

  }

  getTeamSkillMatch(){
    const Did = this.getDeveloper()._id;
    const Dskills = _.filter(this.props.developerSkill, function (skill) { return skill.developerID == Did; });
    const Tskill = this.props.teamSkills;
    console.log(Dskills);
    console.log(Tskill);
    const SkillTeams = [];
    _.each(Dskills, function (skill) {
      const tempTeam = {}; tempTeam.skillID = skill.skillID; tempTeam.skillLevel = skill.skillLevel; tempTeam.teams = _.filter(Tskill, function (teamskill) { return teamskill.skillID == skill.skillID; });
      SkillTeams.push(tempTeam);
    }, SkillTeams);
    return SkillTeams;
  }

  getTeamChallengeSkillMatch() {
    const challengeTeam = this.getTeamChallenge_match();
    const SkillTeam = this.getTeamSkillMatch();
    console.log(challengeTeam);
    console.log(SkillTeam);

  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {

    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {

    return (
        <div>
          <Container>

            <Header as="h1" textAlign="center">Browse for Teams</Header>
          </Container>
          { this.getAllOpenTeam() }
          { console.log(this.getTeamChallenge_match()) }
          {this.renderTeamChallenge_match()}

          {this.getTeamChallengeSkillMatch()}

        </div>
    );
  }
}

/** Require an array of Book documents in the props. */
TeamDisplay.propTypes = {
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
    ready: subscriptionChallenges.ready() && subscriptionSkills.ready() && subscriptionTools.ready() && subscriptionDevelopers.ready() && subscriptionTeams.ready() && subscriptionDeveloperChallenges.ready() && subscriptionTeamChallenges.ready() && subscriptionDeveloperSkill.ready() && subscriptionTeamSkill.ready() && subscriptionTeamTool.ready(),
  };
})(TeamDisplay);
