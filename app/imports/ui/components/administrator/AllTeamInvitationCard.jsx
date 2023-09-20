import React, { useState } from 'react';
import { ListGroup, Modal, Card, Button, Container, Col, Row } from 'react-bootstrap';
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
    return arr.length === 0 ? 'None' : arr.reduce((accumulator, current) => accumulator.concat(', ', current));
  }

  return (
      <ListGroup.Item>
        <div
            style={{
              background: hovered ? 'lightgray' : 'white',
              cursor: 'pointer',
            }}
            onClick={handleShow}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
          <Container>
            <Row>
              <Col xs="auto">
                <FaUsers size={35} />
              </Col>
              <Col xs="auto">
                <h2 style={{ fontWeight: 'bold' }}>{props.teams.name}</h2>
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col>
                <b style={{ fontSize: '20px' }}>Challenges</b>
                {props.challenges.slice(0, 3).map((challenge) => <p
                    style={{ color: 'rgb(89, 119, 199)' }}
                    key={challenge}>
                  {challenge}</p>)}
              </Col>
              <Col>
                <b style={{ fontSize: '20px' }}>Skills</b>
                {props.skills.slice(0, 3).map((skill) => <p key={skill}>
                  {skill}</p>)}
              </Col>
              <Col>
                <b style={{ fontSize: '20px' }}>Tools</b>
                {props.tools.slice(0, 3).map((tool) => <p key={tool}>
                  {tool}</p>)}
              </Col>
              <Col>
                <b style={{ fontSize: '20px' }}>Member(s) Invited</b>
                {invitedMembers.slice(0, 3).map((members) => <p key={members}>
                  {members}</p>)}
              </Col>
              <Col></Col>
            </Row>
          </Container>
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{props.teams.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Container>
                <Row style={{ paddingBottom: '15px' }}>
                  <b style={{ fontSize: '20px' }}>Description</b>
                  <p style={{ fontSize: '16px' }}>{props.teams.description}</p>
                </Row>
                <Row style={{ paddingBottom: '15px' }}>
                  <b style={{ fontSize: '20px' }}>Challenges</b>
                  <p style={{ fontSize: '16px' }}>
                    {commaList(props.challenges)}
                  </p>
                </Row>
                <Row style={{ paddingBottom: '15px' }}>
                  <b style={{ fontSize: '20px' }}>Skills</b>
                  <p style={{ fontSize: '16px' }}>
                    {commaList(props.skills)}
                  </p>
                </Row>
                <Row style={{ paddingBottom: '15px' }}>
                  <b style={{ fontSize: '20px' }}>Tools</b>
                  <p style={{ fontSize: '16px' }}>
                    {commaList(props.tools)}
                  </p>
                </Row>
                <Row style={{ paddingBottom: '15px' }}>
                  <b style={{ fontSize: '20px' }}>Members</b>
                  <p style={{ fontSize: '16px' }}>
                    {commaList(props.participants.map(
                        participant => participant.firstName.concat(' ', participant.lastName),
                    ))}
                  </p>
                </Row>
                <Row style={{ paddingBottom: '15px' }}>
                  <b style={{ fontSize: '20px' }}>Members Invited</b>
                  <p style={{ fontSize: '16px' }}>
                    {commaList(invitedMembers)}
                  </p>
                </Row>
              </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
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
