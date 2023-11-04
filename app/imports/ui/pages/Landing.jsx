import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { FaEye, FaGavel } from 'react-icons/fa6';

const Landing = () => {
  /** @type { React.CSSProperties } */
  const instructionLabelStyles = {
    fontSize: 30,
    fontStyle: 'italic',
    margin: 15,
  };
  /** @type { React.CSSProperties } */
  const instructionDescriptionStyles = {
    fontSize: 20,
    fontStyle: 'italic',
  };
  /** @type { React.CSSProperties } */
  const colStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };
  /** @type { React.CSSProperties } */
  const descriptionStyles = {
    fontSize: 20,
    fontWeight: 400,
    color: '#0B2C52',
  };

  return (
    <Container fluid id="landing-page" className="g-0">
      <Row style={{ margin: 50 }}>
        <Col
          width={8}
          style={{ ...colStyles, alignItems: 'flex-start', gap: '1rem' }}
        >
          <h1
            style={{
              color: '#0B2C52',
              fontSize: 36,
              fontWeight: 600,
            }}
          >
            Welcome to HACC-Hui
          </h1>
          <p style={descriptionStyles}>
            Our goal is to simplify team formation and ongoing team management
            for the Hawaii Annual Code Challenge.
          </p>
          <p style={descriptionStyles}>
            Here you can create a new team or join an already made one. Our
            application can help you find the perfect team for you, or help you
            look for members that fit your team&apos;s requirements.
          </p>
          <div style={{ fontFamily: ['gotham', 'sans-serif'] }}>
            <h2 style={{ ...descriptionStyles, fontSize: 24 }}>
              <b>Deadlines:</b>
            </h2>
            <h3 style={descriptionStyles}>
              Team Formation: <b>October 18th, 5 pm.</b>
            </h3>
            <h3 style={descriptionStyles}>
              Team Challenge selection: <b>October 18th, 5 pm.</b>
            </h3>
          </div>
        </Col>
        <Col xs={12} md={6} style={colStyles}>
          <Image fluid src="/images/HACC_icon_2022.png" />
        </Col>
      </Row>
      <div
        style={{
          backgroundColor: '#E5F0FE',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          paddingBottom: '2rem',
        }}
      >
        <Row>
          <Col xs={12} md={6} style={colStyles}>
            <Image fluid src="/images/profile8.png" />
            <b style={instructionLabelStyles}>Develop your profile</b>
            <p style={instructionDescriptionStyles}>
              Create your profile to participate in HACC
            </p>
          </Col>
          <Col xs={12} md={6} style={colStyles}>
            <Image fluid src="/images/team.png" />
            <b style={instructionLabelStyles}>Create a team</b>
            <p style={instructionDescriptionStyles}>
              Create your team to solve a challenge and win the HACC
            </p>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6} style={colStyles}>
            <Image fluid src="/images/join.png" />
            <b style={instructionLabelStyles}>Join a team</b>
            <p style={instructionDescriptionStyles}>
              Find a team to join and tackle a challenge together
            </p>
          </Col>
          <Col xs={12} md={6} style={colStyles}>
            <Image fluid src="/images/slackicon.png" />
            <b style={instructionLabelStyles}>Utilize Slack</b>
            <p style={instructionDescriptionStyles}>
              Communicate with your team through Slack
            </p>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6} style={colStyles}>
            <FaEye size={'8em'} />
            <b style={instructionLabelStyles}>
              <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
            </b>
          </Col>
          <Col xs={12} md={6} style={colStyles}>
            <FaGavel size={'8em'} />
            <b style={instructionLabelStyles}>
              <a href="https://hacc.hawaii.gov/hacc-judging-criteria/">
                HACC Judging Criteria
              </a>
            </b>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Landing;
