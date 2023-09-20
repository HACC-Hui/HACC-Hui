import React from 'react';
import PropTypes from 'prop-types';
import { useTracker } from 'meteor/react-meteor-data';

import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

import ListTeamsRowWidget from './ListTeamsRowWidget';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';

const ListTeamsTableWidget = ({ teams }) => {
  const { ready, closedTeamsCount } = useTracker(() => {
    const teamsSub = Teams.subscribe();
    const count = Teams.find({ open: false }).count();

    return {
      ready: teamsSub.ready(),
      closedTeamsCount: count,
    };
  }, []);

  const getTeam = (teamID) => {
    return Teams.findDoc(teamID);
  };

  const getTeamChallenges = (team) => {
    const teamID = team._id;
    const teamChallengeDocs = TeamChallenges.find({ teamID }).fetch();
    const challengeTitles = teamChallengeDocs.map(
      (tc) => Challenges.findDoc(tc.challengeID).title,
    );
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

  const getTeamMembers = (team) => {
    const teamID = team._id;
    const teamParticipants = TeamParticipants.find({ teamID }).fetch();
    const memberNames = teamParticipants.map((tp) =>
      Participants.getFullName(tp.participantID),
    );
    return memberNames;
  };

  return ready ? (
    <>
      <Table bordered responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Challenges</th>
            <th>Desired Skills</th>
            <th>Desired Tools</th>
            <th>Devpost / Github</th>
            <th>Members</th>
            <th>Join?</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <ListTeamsRowWidget
              key={team._id}
              team={getTeam(team._id)}
              teamChallenges={getTeamChallenges(team)}
              teamSkills={getTeamSkills(team)}
              teamTools={getTeamTools(team)}
              teamMembers={getTeamMembers(team)}
            />
          ))}
        </tbody>
      </Table>
      {closedTeamsCount > 0 ? (
        <Alert variant="info">There are {closedTeamsCount} closed teams.</Alert>
      ) : undefined}
    </>
  ) : (
    <Spinner animation="border" />
  );
};

ListTeamsTableWidget.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.object),
};

export default ListTeamsTableWidget;
