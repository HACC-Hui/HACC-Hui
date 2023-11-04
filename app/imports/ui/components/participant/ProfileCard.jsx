import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaComment, FaGithub, FaLinkedin, FaSlack } from 'react-icons/fa';
import { MdWeb } from 'react-icons/md';

import SkillItem from './SkillItem';
import ToolItem from './ToolItem';

const ProfileCard = ({ model }) => {
  const linkStyles = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '.5rem',
    fontSize: '18px',
    width: 'max-content',
  };

  const rowStyles = {
    marginBottom: '2rem',
  };

  const prettifyUrl = (url) => {
    if (url.startsWith('https://')) {
      return url.slice(8);
    }
    if (url.startsWith('http://')) {
      return url.slice(7);
    }
    return url;
  };

  return (
    <Card>
      <Card.Body>
        <Row style={rowStyles}>
          <Card.Title as={'h2'}>
            {model.firstName} {model.lastName}
          </Card.Title>
        </Row>
        <Row style={rowStyles}>
          {model.gitHub ? (
            <Col>
              <a href={model.gitHub} style={linkStyles}>
                <FaGithub size={24} />
                <span>{prettifyUrl(model.gitHub)}</span>
              </a>
            </Col>
          ) : undefined}
          {model.linkedIn ? (
            <Col>
              <a href={model.linkedIn} style={linkStyles}>
                <FaLinkedin size={24} />
                <span>{prettifyUrl(model.linkedIn)}</span>
              </a>
            </Col>
          ) : undefined}
          {model.website ? (
            <Col>
              <a href={model.website} style={linkStyles}>
                <MdWeb size={24} />
                <span>{prettifyUrl(model.website)}</span>
              </a>
            </Col>
          ) : undefined}
          {model.slackUsername ? (
            <Col>
              <a href={model.slackUsername} style={linkStyles}>
                <FaSlack size={24} />
                <span>{model.slackUsername}</span>
              </a>
            </Col>
          ) : undefined}
        </Row>
        <Row style={rowStyles}>
          <Col>
            <h3>
              <FaComment size={30} /> About me:
            </h3>
            {model.aboutMe ? (
              <p style={{ fontSize: '16px' }}>{model.aboutMe}</p>
            ) : (
              <p style={{ fontSize: '16px', textDecoration: 'italics' }}>
                Edit your profile to fill out your about me.
              </p>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>Challenges</h3>
              </ListGroup.Item>
              {model.challenges.map((item) => (
                <ListGroup.Item key={item}>{item}</ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col>
            <ListGroup
              variant="flush
            "
            >
              <ListGroup.Item>
                <h3>Skills</h3>
              </ListGroup.Item>
              {model.skills.map((item) => (
                <SkillItem item={item} key={item._id} />
              ))}
            </ListGroup>
          </Col>
          <Col>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>Tools</h3>
              </ListGroup.Item>
              {model.tools.map((item) => (
                <ToolItem item={item} key={item._id} />
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

ProfileCard.propTypes = {
  model: PropTypes.object.isRequired,
};

export default ProfileCard;
