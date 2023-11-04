import React from 'react';
import { ListGroup, Container } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import AllTeamInvitationCard from '../../components/administrator/AllTeamInvitationCard';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';

const AllTeamInvitationsPage = () => {
  const {
    teamChallenges,
    teamInvitations,
    teamSkills,
    teamTools,
    teams,
    skills,
    challenges,
    tools,
    participants,
    teamParticipants,
  } = useTracker(() => {
    const tChallengesDocs = TeamChallenges.find({}).fetch();
    const tInvitationsDocs = TeamInvitations.find({}).fetch();
    const tSkillsDocs = TeamSkills.find({}).fetch();
    const tToolsDocs = TeamTools.find({}).fetch();
    const teamsDocs = Teams.find({}).fetch();
    const skillsDocs = Skills.find({}).fetch();
    const challengesDocs = Challenges.find({}).fetch();
    const toolsDocs = Tools.find({}).fetch();
    const participantsDocs = Participants.find({}).fetch();
    const tParticipantsDocs = TeamParticipants.find({}).fetch();

    return {
      teamChallenges: tChallengesDocs,
      teamInvitations: tInvitationsDocs,
      teamSkills: tSkillsDocs,
      teamTools: tToolsDocs,
      teams: teamsDocs,
      skills: skillsDocs,
      challenges: challengesDocs,
      tools: toolsDocs,
      participants: participantsDocs,
      teamParticipants: tParticipantsDocs,
    };
  }, []);

  // eslint-disable-next-line no-unused-vars
  const sortBy = [
    { key: 'teams', text: 'teams', value: 'teams' },
    { key: 'challenges', text: 'challenges', value: 'challenges' },
    { key: 'skills', text: 'skills', value: 'skills' },
    { key: 'tools', text: 'tools', value: 'tools' },
  ];

  const universalTeams = teams;

  const getTeamInvitations = (invs) => {
    const data = new Set();
    for (let i = 0; i < invs.length; i++) {
      for (let j = 0; j < universalTeams.length; j++) {
        if (invs[i].teamID === universalTeams[j]._id) {
          data.add(universalTeams[j]);
        }
      }
    }
    return Array.from(data);
  };

  const universalSkills = skills;

  const getTeamSkills = (teamID) => {
    const data = [];
    const matchingSkills = teamSkills.filter(
      (teamSkill) => teamSkill.teamID === teamID,
    );
    matchingSkills.forEach((mSkill) => {
      universalSkills.forEach((uSkill) => {
        if (mSkill.skillID === uSkill._id) {
          data.push(uSkill.name);
        }
      });
    });
    return data;
  };

  const universalTools = tools;

  const getTeamTools = (teamID) => {
    const data = [];
    const matchingTools = teamTools.filter(
      (teamTool) => teamTool.teamID === teamID,
    );
    matchingTools.forEach((mTool) => {
      universalTools.forEach((uTool) => {
        if (mTool.toolID === uTool._id) {
          data.push(uTool.name);
        }
      });
    });
    return data;
  };

  const universalChallenges = challenges;

  const getTeamChallenges = (teamID) => {
    const data = [];
    const matchingChallenges = teamChallenges.filter(
      (teamChallenge) => teamChallenge.teamID === teamID,
    );
    matchingChallenges.forEach((mChallenge) => {
      universalChallenges.forEach((uChallenge) => {
        if (mChallenge.challengeID === uChallenge._id) {
          data.push(uChallenge.title);
        }
      });
    });
    return data;
  };

  const allDevelopers = participants;

  const getTeamDevelopers = (teamID) => {
    const data = [];
    const matchingParticipants = teamParticipants.filter(
      (teamParticipant) => teamParticipant.teamID === teamID,
    );
    matchingParticipants.forEach((mParticipant) => {
      allDevelopers.forEach((dev) => {
        if (mParticipant.participantID === dev._id) {
          data.push({
            firstName: dev.firstName,
            lastName: dev.lastName,
          });
        }
      });
    });
    return data;
  };

  return (
    <Container id="all-team-invitations-page">
      <h1 style={{ paddingTop: '2rem' }}>Team Invitations</h1>
      <ListGroup variant="flush">
        {getTeamInvitations(teamInvitations).map((tInvitation) => (
          <AllTeamInvitationCard
            key={tInvitation._id}
            teams={tInvitation}
            skills={getTeamSkills(tInvitation._id)}
            tools={getTeamTools(tInvitation._id)}
            challenges={getTeamChallenges(tInvitation._id)}
            participants={getTeamDevelopers(tInvitation._id)}
          />
        ))}
      </ListGroup>
    </Container>
  );
};

export default withAllSubscriptions(AllTeamInvitationsPage);
