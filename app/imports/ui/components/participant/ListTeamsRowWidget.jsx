import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import swal from 'sweetalert';

import { Participants } from '../../../api/user/ParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const ListTeamsRowWidget = ({
  team,
  teamChallenges,
  teamSkills,
  teamTools,
  teamMembers,
}) => {
  const { ready, participant, participantName, teamName, joinRequests } =
    useTracker(() => {
      const participantsSub = Participants.subscribe();
      const teamsSub = Teams.subscribe();
      const slugsSub = Slugs.subscribe();
      const wantsToJoinSub = WantsToJoin.subscribe();

      const participantDoc = Participants.findOne({
        userID: Meteor.user()._id,
      });
      const name = Participants.getFullName(participantDoc._id);

      const teamDoc = Teams.findDoc(team._id);
      const teamNameDoc = Slugs.getNameFromID(teamDoc.slugID);

      const joinRequestDocs = WantsToJoin.find({
        teamID: team._id,
      }).fetch();

      const rdy =
        participantsSub.ready() &&
        teamsSub.ready() &&
        slugsSub.ready() &&
        wantsToJoinSub.ready();

      return {
        ready: rdy,
        participant: participantDoc,
        participantName: name,
        teamName: teamNameDoc,
        joinRequests: joinRequestDocs,
      };
    }, [team]);

  const [sent, setSent] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();

    const collectionName = WantsToJoin.getCollectionName();
    const participantUsername = participant.username;
    const definitionData = {
      teamName,
      participantUsername,
    };
    // console.log(collectionName, definitionData);

    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        swal('Sent Request Fail', error, 'error');
      } else {
        swal('Success', 'Join Request Sent', 'success');
        setSent(true);
      }
    });
  };

  const renderJoinButton = () => {
    const isAMember = teamMembers.includes(participantName);
    const joinSentUsers = joinRequests.map((req) => req.participantID);
    const requested = joinSentUsers.includes(participant._id);

    const buttonStyles = {
      textAlign: 'center',
    };

    let disabled = false;
    let msg = 'Request to Join';
    let onClickHandler = () => {};
    if (isAMember) {
      disabled = true;
      msg = 'You own the team';
    }
    if (sent || requested) {
      disabled = true;
      msg = 'You sent the request';
    }
    if (!isAMember && !sent && !requested) {
      onClickHandler = handleJoin;
    }

    return (
      <Button
        size="lg"
        variant="success"
        disabled={disabled}
        onClick={onClickHandler}
        style={buttonStyles}
      >
        {msg}
      </Button>
    );
  };

  const colStyles = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };

  return ready ? (
    <tr>
      <td>{team.name}</td>
      <td>
        <ListGroup>
          {teamChallenges.map((challenge) => (
            <ListGroup.Item key={challenge}>{challenge}</ListGroup.Item>
          ))}
        </ListGroup>
      </td>
      <td>
        <ListGroup>
          {teamSkills.map((skill) => (
            <ListGroup.Item key={skill}>{skill}</ListGroup.Item>
          ))}
        </ListGroup>
      </td>
      <td>
        <ListGroup>
          {teamTools.map((tool) => (
            <ListGroup.Item key={tool}>{tool}</ListGroup.Item>
          ))}
        </ListGroup>
      </td>
      <td>
        <Col style={colStyles}>
          <Button href={team.devPostPage}>Devpost Page</Button>
          <Button href={team.gitHubRepo}>GitHub Repository</Button>
        </Col>
      </td>
      <td>
        <ListGroup>
          {teamMembers.map((member) => (
            <ListGroup.Item key={member}>{member}</ListGroup.Item>
          ))}
        </ListGroup>
      </td>
      <td>
        <Col style={colStyles}>{renderJoinButton()}</Col>
      </td>
    </tr>
  ) : (
    <tr>
      {[1, 2, 3, 4, 5, 6, 7].map((key) => (
        <td key={key}>
          <Spinner animation="border" />
        </td>
      ))}
    </tr>
  );
};

ListTeamsRowWidget.propTypes = {
  team: PropTypes.object.isRequired,
  teamChallenges: PropTypes.arrayOf(PropTypes.string).isRequired,
  teamSkills: PropTypes.arrayOf(PropTypes.string).isRequired,
  teamTools: PropTypes.arrayOf(PropTypes.string).isRequired,
  teamMembers: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ListTeamsRowWidget;
