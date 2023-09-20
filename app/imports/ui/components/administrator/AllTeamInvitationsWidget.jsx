import React from 'react';
import { ListGroup, Container, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import AllTeamInvitationCard from '../administrator/AllTeamInvitationCard';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
const AllTeamInvitationsWidget = (props) => {
  // eslint-disable-next-line no-unused-vars
  const sortBy = [
    { key: 'teams', text: 'teams', value: 'teams' },
    { key: 'challenges', text: 'challenges', value: 'challenges' },
    { key: 'skills', text: 'skills', value: 'skills' },
    { key: 'tools', text: 'tools', value: 'tools' },
  ];

  const universalTeams = props.teams;

  function getTeamInvitations(invs) {
    const data = new Set();
    for (let i = 0; i < invs.length; i++) {
      for (let j = 0; j < universalTeams.length; j++) {
        if (invs[i].teamID === universalTeams[j]._id) {
          data.add(universalTeams[j]);
        }
      }
    }
    return Array.from(data);
  }

  const universalSkills = props.skills;

  function getTeamSkills(teamID, teamSkills) {
    const data = [];
    const skills = teamSkills.filter(teamSkill => teamSkill.teamID === teamID);
    for (let i = 0; i < skills.length; i++) {
      for (let j = 0; j < universalSkills.length; j++) {
        if (skills[i].skillID === universalSkills[j]._id) {
          data.push(universalSkills[j].name);
        }
      }
    }
    return data;
  }

  const universalTools = props.tools;

  function getTeamTools(teamID, teamTools) {
    const data = [];
    const tools = teamTools.filter(teamTool => teamTool.teamID === teamID);
    for (let i = 0; i < tools.length; i++) {
      for (let j = 0; j < universalTools.length; j++) {
        if (tools[i].toolID === universalTools[j]._id) {
          data.push(universalTools[j].name);
        }
      }
    }
    return data;
  }

  const universalChallenges = props.challenges;

  function getTeamChallenges(teamID, teamChallenges) {
    const data = [];
    const challenges = teamChallenges.filter(teamChallenge => teamChallenge.teamID === teamID);
    for (let i = 0; i < challenges.length; i++) {
      for (let j = 0; j < universalChallenges.length; j++) {
        if (challenges[i].challengeID === universalChallenges[j]._id) {
          data.push(universalChallenges[j].title);
        }
      }
    }
    return data;
  }

  const allDevelopers = props.participants;

  function getTeamDevelopers(teamID, teamParticipants) {
    const data = [];
    const participants = teamParticipants.filter(teamParticipant => teamParticipant.teamID === teamID);
    for (let i = 0; i < participants.length; i++) {
      for (let j = 0; j < allDevelopers.length; j++) {
        if (participants[i].participantID === allDevelopers[j]._id) {
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
      <Container id="all-team-invitations-page">
        <Row>
          <h2 style={{ paddingTop: '2rem' }}>
            Team Invitations
          </h2>
        </Row>
        <Col width={16}>
          <ListGroup variant="flush">
            {getTeamInvitations(props.teamInvitations).map((teams) => <AllTeamInvitationCard
                key={teams._id}
                teams={teams}
                skills={getTeamSkills(teams._id, props.teamSkills)}
                tools={getTeamTools(teams._id, props.teamTools)}
                challenges={getTeamChallenges(teams._id, props.teamChallenges)}
                participants={getTeamDevelopers(teams._id, props.teamParticipants)}/>)}
          </ListGroup>
        </Col>
      </Container>
  );
};

AllTeamInvitationsWidget.propTypes = {
  teamChallenges: PropTypes.array.isRequired,
  teamSkills: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  teamTools: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  teamParticipants: PropTypes.array.isRequired,
  teamInvitations: PropTypes.array.isRequired,

};

export default withTracker(() => ({
  teamChallenges: TeamChallenges.find({}).fetch(),
  teamInvitations: TeamInvitations.find().fetch(),
  teamSkills: TeamSkills.find({}).fetch(),
  teamTools: TeamTools.find({}).fetch(),
  teams: Teams.find({}).fetch(),
  skills: Skills.find({}).fetch(),
  challenges: Challenges.find({}).fetch(),
  tools: Tools.find({}).fetch(),
  participants: Participants.find({}).fetch(),
  teamParticipants: TeamParticipants.find({}).fetch(),
}))(AllTeamInvitationsWidget);
