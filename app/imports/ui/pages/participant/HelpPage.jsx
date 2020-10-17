import React from 'react';
import { Header, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class HelpPage extends React.Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontSize: '40px',
            paddingTop: '20px',
          }}
        >
          Questions By Category
        </p>
        <Divider horizontal>GENERAL</Divider>
        <Header as="h1" textAlign="center">
          <b>How do I Register?</b>
        </Header>
        <Header as="h2" textAlign="center">
          <a href={'https://slack.com/signin#/signin'}>
            Join The Slack Workspace
          </a>
        </Header>
        <p>
          <b>
            You will need to make a Slack account if you do not have a
            pre-existing one <br></br> Join the Slack Workspace and type
            `&ldquo;register`&rdquo; <br></br> You will then be given a username and password
            to login.
          </b>
        </p>
        <div style={{ paddingTop: '40px' }}>
          <Header as="h1" textAlign="center">
            <b>What is HACC HUI?</b>
          </Header>
          <h4>
            <b>
              HACC HUI is an official HACC 2020 site to help participants create
              and manage their teams
            </b>
          </h4>
        </div>
        <Divider horizontal style={{ paddingTop: '40px' }}>
          TEAM MANAGEMENT
        </Divider>
        <Header as="h1" textAlign="center">
          <b>Where can I find Teammates?</b>
        </Header>
        <Header as="h2" textAlign="center">
          <Link to="list-participants">
            <text>List Participants Page</text>
          </Link>
        </Header>
        <p>
          <b>
            You can view/send an invitation to all participants through this
            page!
          </b>
        </p>
        <div style={{ paddingTop: '40px' }}>
          <Header as="h1" textAlign="center">
            <b>How do I Leave/Delete my Team?</b>
          </Header>
          <Header as="h2" textAlign="center">
            <Link to="your-teams">
              <text>Edit Teams Page</text>
            </Link>
          </Header>
          <p>
            <b>
              Here you can leave, delete, invite, and recruit for your team!
            </b>
          </p>
        </div>
        <div style={{ paddingTop: '40px' }}>
          <Header as="h1" textAlign="center">
            <b>How do I Create a Team?</b>
          </Header>
          <Header as="h2" textAlign="center">
            <Link to="create-team">
              <text>Create Teams Page</text>
            </Link>
          </Header>
          <p>
            <b>Make sure to fill out the team creation form fully</b>
          </p>
        </div>
        <div style={{ paddingTop: '40px' }}>
          <Header as="h1" textAlign="center">
            <b>Can I be on Multiple Teams?</b>
          </Header>
          <Header as="h2" textAlign="center">
            Yes!
          </Header>
          <p>
            <b>
              Although it is suggested that you stay with one team, you are
              allowed to join multiple teams.
            </b>
          </p>
        </div>
        <Divider horizontal style={{ paddingTop: '40px' }}>
          UNEXPECTED ERRORS
        </Divider>
        <div style={{ paddingTop: '10px', paddingBottom: '30px' }}>
          <Header as="h1" textAlign="center">
            <b>Site not Functioning Properly?</b>
          </Header>
          <Header as="h3" textAlign="center">
            Please screenshot the problem and direct message cmoore@hawaii.edu
            on Slack
          </Header>
        </div>
      </div>
    );
  }
}

export default HelpPage;
