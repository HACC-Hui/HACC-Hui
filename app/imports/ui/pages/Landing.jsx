import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { FaEye, FaGavel } from 'react-icons/fa6';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
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

  return (
    <Container fluid>
      <Row style={{ margin: 50 }}>
        <Col
          width={8}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <b
            style={{
              color: '#0B2C52',
              fontSize: 30,
              alignSelf: 'flex-start',
              paddingLeft: 20,
              marginBottom: 15,
            }}
          >
            Welcome to HACC-Hui
          </b>
          <p style={{ fontSize: 20, paddingLeft: 20, color: '#0B2C52' }}>
            Our goal is to simplify team formation and ongoing team management
            for the Hawaii Annual Code Challenge.
            <br />
            <br />
            Here you can create a new team or join an already made one. Our
            application can help you find the perfect team for you, or help you
            look for members that fit your team’s requirements.
            <br />
            <br />
            <b>Deadlines:</b> <br />
            Team Formation: <b>October 18th, 5 pm.</b>
            <br />
            Team Challenge selection: <b>October 18th, 5 pm.</b>
          </p>
        </Col>
        <Col
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image fluid src="/images/HACC_icon_2022.png" />
        </Col>
      </Row>
      <Row style={{ backgroundColor: '#E5F0FE' }}>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Image fluid src="/images/profile8.png" />
          <b style={instructionLabelStyles}>Develop your profile</b>
          <p style={instructionDescriptionStyles}>
            Create your profile to participate in HACC
          </p>
        </Col>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Image fluid src="/images/team.png" />
          <b style={instructionLabelStyles}>Create a team</b>
          <p style={instructionDescriptionStyles}>
            Create your team to solve a challenge and win the HACC
          </p>
        </Col>
      </Row>
      <Row style={{ backgroundColor: '#E5F0FE' }}>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Image centered size="small" src="/images/join.png" />
          <b style={instructionLabelStyles}>Join a team</b>
          <p style={instructionDescriptionStyles}>
            Find a team to join and tackle a challenge together
          </p>
        </Col>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Image centered size="small" src="/images/slackicon.png" />
          <b style={instructionLabelStyles}>Utilize Slack</b>
          <p style={instructionDescriptionStyles}>
            Communicate with your team through Slack
          </p>
        </Col>
      </Row>
      <Row style={{ backgroundColor: '#E5F0FE', marginBottom: 15 }}>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <FaEye size={'8em'} />
          <b style={instructionLabelStyles}>
            <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
          </b>
        </Col>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <FaGavel size={'8em'} />
          <b style={instructionLabelStyles}>
            <a href="https://hacc.hawaii.gov/hacc-judging-criteria/">
              HACC Judging Criteria
            </a>
          </b>
        </Col>
      </Row>
    </Container>
  );
};

export default Landing;
