import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

import { Participants } from '../../../api/user/ParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import ListTeamsTableWidget from '../../components/participant/ListTeamsTableWidget';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';

const OpenTeamsPage = () => {
  const { developerReady, developer } = useTracker(() => {
    const subscriptionDevelopers = Participants.subscribe();
    const developerTracker = Participants.findOne({
      userID: Meteor.user()._id,
    });

    return {
      developerReady: subscriptionDevelopers.ready(),
      developer: developerTracker,
    };
  }, []);

  const { ready, openTeams, pChallenges, pSkills, pTools } = useTracker(() => {
    const subscriptionDeveloperChallenges = ParticipantChallenges.subscribe();
    const subscriptionDeveloperSkill = ParticipantSkills.subscribe();
    const subscriptionDeveloperTools = ParticipantTools.subscribe();
    const subscriptionTeams = Teams.subscribe();
    const subscriptionTeamChallenges = TeamChallenges.subscribe();
    const subscriptionTeamSkill = TeamSkills.subscribe();
    const subscriptionTeamTool = TeamTools.subscribe();

    const openTeamsTracker = Teams.find({ open: true }).fetch();
    const participantId = developer._id;
    const participantChallengesTracker = ParticipantChallenges.find({
      participantId,
    }).fetch();
    const participantSkillsTracker = ParticipantSkills.find({
      participantId,
    }).fetch();
    const participantToolsTracker = ParticipantTools.find({
      participantId,
    }).fetch();

    return {
      ready:
        subscriptionTeams.ready() &&
        subscriptionDeveloperChallenges.ready() &&
        subscriptionTeamChallenges.ready() &&
        subscriptionDeveloperSkill.ready() &&
        subscriptionTeamSkill.ready() &&
        subscriptionTeamTool.ready() &&
        subscriptionDeveloperTools.ready(),
      openTeams: openTeamsTracker,
      pChallenges: participantChallengesTracker,
      pSkills: participantSkillsTracker,
      pTools: participantToolsTracker,
    };
  }, [developerReady, developer]);

  const [select, setSelect] = useState('challenges');

  // Thanks, Mr. GPT
  const intersectionBy = (arr1, arr2, prop) => {
    return arr1.filter((item1) => {
      return arr2.some((item2) => {
        return item1[prop] === item2[prop];
      });
    });
  };

  const getTeamsByAlphabetical = () => {
    return openTeams.sort((teamA, teamB) => {
      return teamA.name.toLowerCase().localeCompare(teamB.name.toLowerCase());
    });
  };

  const getTeamsByChallengeMatch = () => {
    openTeams.forEach((t) => {
      const team = t;
      const tChallenges = TeamChallenges.find({ teamID: team._id }).fetch();
      team.priority = intersectionBy(
        pChallenges,
        tChallenges,
        'challengeID',
      ).length;
    });
    return openTeams
      .sort((teamA, teamB) => {
        return teamA.priority - teamB.priority;
      })
      .reverse();
  };

  const getTeamsBySkillMatch = () => {
    openTeams.forEach((t) => {
      const team = t;
      const tSkills = TeamSkills.find({ teamID: team._id }).fetch();
      team.priority = intersectionBy(pSkills, tSkills, 'skillID').length;
    });
    return openTeams
      .sort((teamA, teamB) => {
        return teamA.priority - teamB.priority;
      })
      .reverse();
  };

  const getTeamsByToolMatch = () => {
    openTeams.forEach((t) => {
      const team = t;
      const tTools = TeamTools.find({ teamID: team._id }).fetch();
      team.priority = intersectionBy(pTools, tTools, 'toolID').length;
    });
    return openTeams
      .sort((teamA, teamB) => {
        return teamA.priority - teamB.priority;
      })
      .reverse();
  };

  const getTeamsByBestMatch = () => {
    openTeams.forEach((t) => {
      const team = t;
      const tChallenges = TeamChallenges.find({ teamID: team._id }).fetch();
      const tSkills = TeamSkills.find({ teamID: team._id }).fetch();
      const tTools = TeamTools.find({ teamID: team._id }).fetch();
      team.priority =
        intersectionBy(pChallenges, tChallenges, 'challengeID').length * 5;
      team.priority = intersectionBy(pSkills, tSkills, 'skillID').length;
      team.priority = intersectionBy(pTools, tTools, 'toolID').length;
    });
    return openTeams
      .sort((teamA, teamB) => {
        return teamA.priority - teamB.priority;
      })
      .reverse();
  };

  const renderDropDown = () => {
    const options = [
      {
        key: 0,
        text: 'Sort by matching challenges',
        value: 'challenges',
      },
      { key: 1, text: 'Sort by best fit', value: 'best' },
      {
        key: 2,
        text: 'Sort by matching skills',
        value: 'skill',
      },
      {
        key: 3,
        text: 'Sort by matching tools',
        value: 'tool',
      },
      {
        key: 4,
        text: 'Sort by name in alphabetical order',
        value: 'AToZ',
      },
    ];
    return (
      <Row className="justify-content-end">
        <Col md={6}>
          <Form.Group>
            <Form.Text style={{ fontSize: '16px' }}>
              Select an option to reorder the teams based on your preferences
            </Form.Text>
            <Form.Select
              size="lg"
              aria-label="Select an option to reorder the teams"
              onChange={(e) => setSelect(e.target.value)}
              value={select}
            >
              {options.map((option) => (
                <option key={option.key} value={option.value}>
                  {option.text}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    );
  };

  let teams;
  switch (select) {
    case 'skill':
      teams = getTeamsBySkillMatch();
      break;
    case 'tool':
      teams = getTeamsByToolMatch();
      break;
    case 'AToZ':
      teams = getTeamsByAlphabetical();
      break;
    case 'best':
      teams = getTeamsByBestMatch();
      break;
    case 'challenges':
    default:
      teams = getTeamsByChallengeMatch();
  }

  return ready ? (
    <Container id="open-teams-page" style={{ padding: '2rem' }}>
      <Card>
        <Card.Header style={{ padding: '1rem' }}>
          <Card.Title
            as={'h1'}
            style={{ textAlign: 'center', fontSize: '32px' }}
          >
            Open Teams
          </Card.Title>
        </Card.Header>
        <Card.Body
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '1rem',
          }}
        >
          {renderDropDown()}
          <ListTeamsTableWidget teams={teams} />
        </Card.Body>
      </Card>
    </Container>
  ) : (
    <Spinner animation="border">
      <span className="visually-hidden">Getting data</span>
    </Spinner>
  );
};

export default OpenTeamsPage;
