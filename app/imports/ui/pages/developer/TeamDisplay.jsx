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
import ChallengeSkillTeams from '../../components/developer/ChallengeSkillTeams';
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
            if (chall_team.teams.length > 0) {
 return <div key={chall_team}>
                <Container>
                  <Header as='h3'>The Following teams have your requested Challenge: {chall_team.Challenge}</Header>
                  <ListTeamsWidget teams={chall_team.teams}/></Container></div>;
}
            return '';
    });

  }

  renderTeamChallenge_skill_match() {
    const Team_challenge_skill_match = this.getTeamChallengeSkillMatch();
    console.log(Team_challenge_skill_match);
    return _.map(Team_challenge_skill_match, function (chall_skill_team) {
      console.log(chall_skill_team);
      return (<div key={chall_skill_team.Challenge}> <Container><Header as='h3'>The Following teams have your requested Challenge: {chall_skill_team.Challenge}</Header>
        <ChallengeSkillTeams chall_skill_teams={chall_skill_team}/>
      </Container></div>);

    });

  }

  getTeamSkillMatch() {
    const Did = this.getDeveloper()._id;
    const Dskills = _.filter(this.props.developerSkill, function (skill) { return skill.developerID == Did; });
    const Tskill = this.props.teamSkills;
    console.log(Dskills);
    console.log(Tskill);
    const SkillTeams = [];
    _.each(Dskills, function (skill) {
      const tempTeam = {}; tempTeam.skillID = skill.skillID; tempTeam.skillName = Skills.findDoc(skill.skillID).name;
      tempTeam.skillLevel = skill.skillLevel; tempTeam.teams = _.filter(Tskill, function (teamskill) {
        return teamskill.skillID == skill.skillID;
});
      SkillTeams.push(tempTeam);
    }, SkillTeams);
    return SkillTeams;
  }

  getTeamChallengeSkillMatch() {
    const challengeTeam = this.getTeamChallenge_match();
    const SkillTeam = this.getTeamSkillMatch();
    console.log(challengeTeam);
    console.log(SkillTeam);

    const Challenge_Skill_Teams = [];
    _.each(challengeTeam, function (challenge) {
 const tempchallenge = {}; const both_challenge_skill_matched = []; tempchallenge.Challenge = challenge.Challenge;
      const teamID_challenge = _.pluck(challenge.teams, '_id'); const skill_match_teams = [];
    _.each(SkillTeam, function (skill) {
 const tempskill = {}; tempskill.skillName = skill.skillName; tempskill.level = skill.skillLevel;
      const teamID_skill = _.pluck(skill.teams, 'teamID');
      const both_challenge_skill_matched_teamID = _.intersection(teamID_challenge, teamID_skill);
      skill_match_teams.push(both_challenge_skill_matched_teamID);
      console.log(both_challenge_skill_matched_teamID);
      if (both_challenge_skill_matched_teamID.length) {
        const both_challenge_skill_matched_teamID_array = [];
        const teamID = {};
        for (let i = 0; i < both_challenge_skill_matched_teamID.length; i++) {
          teamID._id = both_challenge_skill_matched_teamID[i];
          both_challenge_skill_matched_teamID_array.push(teamID);
        }
        console.log(both_challenge_skill_matched_teamID_array);
        tempskill.teams = both_challenge_skill_matched_teamID_array;
        both_challenge_skill_matched.push(tempskill);
        tempchallenge.skill = both_challenge_skill_matched;
      } else {
        const empty_skill = [];
        tempchallenge.skill = empty_skill;
      }

       // skills.push(tempskill);

    });
      Challenge_Skill_Teams.push(tempchallenge);
      console.log(skill_match_teams);
      console.log(teamID_challenge);
      let all = [];
      _.each(skill_match_teams, function (skill_teams) { all = all.concat(skill_teams); });
      const remain = _.difference(teamID_challenge,all);
      console.log(all);
      console.log(remain);
});
    return Challenge_Skill_Teams;

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

          {console.log(this.getTeamChallengeSkillMatch())}
          {this.renderTeamChallenge_skill_match()}

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
