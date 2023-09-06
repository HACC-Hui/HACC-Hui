import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';

function HelpPage() {
  return (
    <Container fluid id="help-page" style={{ backgroundColor: '#E5F0FE' }}>
      <div className="text-center">
        <p
          style={{
            fontSize: '40px',
            paddingTop: '20px',
          }}
        >
          Questions By Category
        </p>
        <h6>GENERAL</h6>
        <Row>
          <Col style={{ paddingTop: '30px' }}>
            <h1 className="text-center">
              <b>How do I Register?</b>
            </h1>
            <h4 className="text-center">
              <a href={'https://slack.com/signin#/signin'}>
                Join The Slack Workspace
              </a>
            </h4>
            <p>
              <b>
                You will need to make a Slack account if you do not have a
                pre-existing one <br></br> Join the Slack Workspace and type
                &apos;register&apos; <br></br> You will then be given a username
                and password to login.
              </b>
            </p>
          </Col>

          <Col style={{ paddingTop: '30px' }}>
            <div>
              <h1 className="text-center">
                <b>What is HACC HUI?</b>
              </h1>
              <h4>
                <b>
                  HACC HUI is an official HACC 2022 site to help participants
                  create and manage their teams
                </b>
              </h4>
            </div>
          </Col>
        </Row>

        <h6 style={{ paddingTop: '40px' }}>TEAM MANAGEMENT</h6>
        <Row>
          <Col style={{ paddingTop: '30px' }}>
            <h1 className="text-center">
              <b>Where can I find Teammates?</b>
            </h1>
            <h4 className="text-center">
              <Link to="list-participants">
                <text>List Participants Page</text>
              </Link>
            </h4>
            <p>
              <b>
                You can view/send an invitation to all participants through this
                page!
              </b>
            </p>

            <div style={{ paddingTop: '100px' }}>
              <h1 className="text-center">
                <b>How do I Leave/Delete my Team?</b>
              </h1>
              <h4 className="text-center">
                <Link to="your-teams">
                  <text>Edit Teams Page</text>
                </Link>
              </h4>
              <p>
                <b>
                  Here you can leave, delete, invite, and recruit for your team!
                </b>
              </p>
            </div>
          </Col>

          <Col style={{ paddingTop: '30px' }}>
            <div>
              <h1 className="text-center">
                <b>How do I Create a Team?</b>
              </h1>
              <h4 className="text-center">
                <Link to="create-team">
                  <text>Create Teams Page</text>
                </Link>
              </h4>
              <p>
                <b>Make sure to fill out the team creation form fully</b>
              </p>
            </div>
            <div style={{ paddingTop: '115px' }}>
              <h1 className="text-center">
                <b>Can I be on Multiple Teams?</b>
              </h1>
              <h4 className="text-center">Yes!</h4>
              <p>
                <b>
                  Although it is suggested that you stay with one team, you are
                  allowed to join multiple teams.
                </b>
              </p>
            </div>
          </Col>
        </Row>

        <h6 style={{ paddingTop: '40px' }}>UNEXPECTED ERRORS</h6>
        <div style={{ paddingTop: '10px', paddingBottom: '30px' }}>
          <h1 className="text-center">
            <b>Site not Functioning Properly?</b>
          </h1>
          <h3 className="text-center">
            Please screenshot the problem and direct message cmoore@hawaii.edu
            on Slack
          </h3>
        </div>
      </div>
    </Container>
  );
}

export default HelpPage;
