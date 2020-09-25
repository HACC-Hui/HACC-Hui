import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import _ from 'underscore';
import ListTeamsWidget from './ListTeamsWidget';

//const getSkillTeam = () => this.props.chall_skill_teams;
class ChallengeSkillTeams extends React.Component {
  render() {
    console.log(this.props);
       const skillTeam = this.props.chall_skill_teams;
       console.log(skillTeam);
      if (skillTeam.skill.length > 0) {
        const experienced_skills = _.filter(skillTeam.skill, function (skill) {
          return skill.level == 'Experienced';
        });
        const Novice_skills = _.filter(skillTeam.skill, function (skill) {
          return skill.level == 'Novice';
        });
        const want_to_know_skills = _.filter(skillTeam.skill, function (skill) {
          return skill.level == 'Don\'t know,but would like to learn';
        });
        const no_match = _.filter(skillTeam.skill, function (skill) {
          return skill.skillName == 'no match';
        });
        console.log(no_match);
        console.log(experienced_skills);
        let ex_skill_teams = '';
        let Novice_skill_teams = '';
        let Want_skill_teams = '';
        let No_skill_teams = '';
        /*ex_skill_teams = experienced_skills ? (_.map(experienced_skills, function (e_skill) {

          return <div key={e_skill.skillName}>
            <Header as='h3'>The Following teams have your skill: {e_skill.skillName}</Header>
            <ListTeamsWidget teams={e_skill.teams}/>

          </div>;
        })) : '';
        var test =  <div><Header as='h3'>The Following teams do not match all your skills for this challenge</Header></div>;*/

       // return ex_skill_teams;
       if (experienced_skills.length > 0) {
          ex_skill_teams = _.map(experienced_skills, function (e_skill) {

            return <div key={e_skill.skillName}>
              <Header as='h3'>The Following teams have your skill: {e_skill.skillName}</Header>
              <ListTeamsWidget teams={e_skill.teams}/>

            </div>;
          });

        }
        if (Novice_skills.length>0) {
          Novice_skill_teams = _.map(Novice_skills, function (e_skill) {

            return <div key={e_skill.skillName}>
              <Header as='h3'>The Following teams have your skill: {e_skill.skillName}</Header>
              <ListTeamsWidget teams={e_skill.teams}/>

            </div>;
          });

        }
        if (want_to_know_skills.length > 0) {
          Want_skill_teams = _.map(want_to_know_skills, function (e_skill) {

            return <div key={e_skill.skillName}>
              <Header as='h3'>The Following teams have your skill: {e_skill.skillName}</Header>
              <ListTeamsWidget teams={e_skill.teams}/>

            </div>;
          });

        }
        if (no_match.length > 0) {


          No_skill_teams =  <div>
              <Header as='h3'>The Following teams do not match any of your skills for this challenge</Header>
            <ListTeamsWidget teams={no_match[0].teams}/>

            </div>;


        }
        return (<div>
          {ex_skill_teams}
          {Novice_skill_teams}
          {Want_skill_teams}
          {No_skill_teams}
        </div>);

      }
    return '';

  }
}

ListTeamsWidget.propTypes = {
  chall_skill_teams: PropTypes.arrayOf(
      PropTypes.object,
  ),
};
export default withRouter(ChallengeSkillTeams);
/*
export default withTracker(() => {
  const teams = Teams.find({}).fetch();
  return {
    teams,
  };
})(ListTeamsWidget);
*/
