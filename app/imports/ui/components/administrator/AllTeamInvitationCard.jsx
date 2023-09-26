import React, { useState } from 'react';
import {
  ListGroup,
  Modal,
  Button,
  Container,
  Col,
  Row,
  Card,
} from 'react-bootstrap';
import { FaUsers } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { Teams } from '../../../api/team/TeamCollection';

const AllTeamInvitationCard = (props) => {
  const [show, setShow] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const teamID = Teams.findDoc({ name: props.teams.name })._id;
  const invitations = TeamInvitations.find({ teamID }).fetch();
  for (let i = 0; i < invitations.length; i++) {
    invitations[i] = invitations[i].participantID;
  }
  const invitedMembers = [];
  invitations.forEach((id) => {
    invitedMembers.push(Participants.getFullName(id));
  });

  function commaList(arr) {
    return arr.length === 0
      ? 'None'
      : arr.reduce((accumulator, current) => accumulator.concat(', ', current));
  }

  const headerStyle = {
    fontWeight: 'bold',
    fontSize: `${20}px`,
    fontFamily: 'gotham',
  };

  const modalPStyle = {
    fontSize: `${18}px`,
  };

  return (
    <ListGroup.Item>
      <Card
        style={{
          paddingBottom: `${2}rem`,
          background: hovered ? '#EEE' : 'white',
          cursor: 'pointer',
        }}
        onClick={handleShow}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Card.Body>
          <Card.Title
            as={'h2'}
            style={{
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: `${1}rem`,
            }}
          >
            <FaUsers size={48} />
            {props.teams.name}
          </Card.Title>

          <Row>
            <Col>
              <h3 style={headerStyle}>Challenges</h3>
              {props.challenges.slice(0, 3).map((challenge) => (
                <p style={{ color: 'rgb(89, 119, 199)' }} key={challenge}>
                  {challenge}
                </p>
              ))}
            </Col>
            <Col>
              <h3 style={headerStyle}>Skills</h3>
              {props.skills.slice(0, 3).map((skill) => (
                <p key={skill}>{skill}</p>
              ))}
            </Col>
            <Col>
              <h3 style={headerStyle}>Tools</h3>{' '}
              {props.tools.slice(0, 3).map((tool) => (
                <p key={tool}>{tool}</p>
              ))}
            </Col>
            <Col>
              <h3 style={headerStyle}>Member(s) Invited</h3>
              {invitedMembers.slice(0, 3).map((members) => (
                <p key={members}>{members}</p>
              ))}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title as={'h2'} style={{ fontWeight: 'bold' }}>
            {props.teams.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container
            style={{ display: 'flex', flexDirection: 'column', gap: `${1}rem` }}
          >
            <div>
              <h3 style={headerStyle}>Description</h3>
              <p style={modalPStyle}>{props.teams.description}</p>
            </div>
            <div>
              <h3 style={headerStyle}>Challenges</h3>
              <p style={modalPStyle}>{commaList(props.challenges)}</p>
            </div>
            <div>
              <h3 style={headerStyle}>Skills</h3>
              <p style={modalPStyle}>{commaList(props.skills)}</p>
            </div>
            <div>
              <h3 style={headerStyle}>Tools</h3>
              <p style={modalPStyle}>{commaList(props.tools)}</p>
            </div>
            <div>
              <h3 style={headerStyle}>Members</h3>
              <p style={modalPStyle}>
                {commaList(
                  props.participants.map((participant) =>
                    participant.firstName.concat(' ', participant.lastName),
                  ),
                )}
              </p>
            </div>
            <div>
              <h3 style={headerStyle}>Members Invited</h3>
              <p style={modalPStyle}>{commaList(invitedMembers)}</p>
            </div>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" size="lg" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </ListGroup.Item>
  );
};

AllTeamInvitationCard.propTypes = {
  teams: PropTypes.object.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
};

export default AllTeamInvitationCard;
