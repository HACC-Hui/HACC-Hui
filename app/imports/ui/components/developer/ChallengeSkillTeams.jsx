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
        if (experienced_skills.length > 0) {
          return _.map(experienced_skills, function (e_skill) {

            return <div key={e_skill.skillName}>
              <Header as='h3'>The Following teams have your skill: {e_skill.skillName}</Header>
              <ListTeamsWidget teams={e_skill.teams}/>

            </div>;
          });

        }
        if (Novice_skills.length > 0) {
          return _.map(Novice_skills, function (e_skill) {

            return <div key={e_skill.skillName}>
              <Header as='h3'>The Following teams have your skill: {e_skill.skillName}</Header>
              <ListTeamsWidget teams={e_skill.teams}/>

            </div>;
          });

        }
        if (want_to_know_skills.length > 0) {
          return _.map(want_to_know_skills, function (e_skill) {

            return <div key={e_skill.skillName}>
              <Header as='h3'>The Following teams have your skill: {e_skill.skillName}</Header>
              <ListTeamsWidget teams={e_skill.teams}/>

            </div>;
          });

        }

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
