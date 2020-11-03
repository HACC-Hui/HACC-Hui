import React from 'react';
import { Header, Divider, Grid, Container, Accordion, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class HelpPage extends React.Component {
  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;
    return (
      <Container stackable>
      <Header as='h1' textAlign='center' style={{
            fontSize: '40px',
            paddingTop: '20px',
          }}>
        Questions By Category
      </Header>
      <Grid divided='vertically' stackable>
      <Grid.Row columns={3}>
        <Grid.Column>
          <Divider horizontal style={{ paddingTop: '40px' }}>GENERAL</Divider>
          <Accordion fluid styled exclusive={false}>
            <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.handleClick}
            >
            <Icon name='dropdown' />
            <Header as='h1' textAlign='center'>
              <b>How do I Register?</b>
            </Header>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <Header as='h2' textAlign='left'>
            <a href={'https://slack.com/signin#/signin'}>
              Join The Slack Workspace
            </a>
            </Header>
            <p>
              <b>
                You will need to make a Slack account if you do not have a
                pre-existing one <br></br> Join the Slack Workspace and type
                &apos;register&apos; <br></br> You will then be given a username and password
                to login.
              </b>
            </p>
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          <Header as='h1' textAlign='center'>
            <b>What is HACC HUI?</b>
          </Header>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <h4>
            <b>
              HACC HUI is an official HACC 2020 site to help participants create
              and manage their teams
            </b>
          </h4>
        </Accordion.Content>
        </Accordion>
        </Grid.Column>
        <Grid.Column>
        <Divider horizontal style={{ paddingTop: '40px' }}>
          TEAM MANAGEMENT
        </Divider>
        <Accordion fluid styled exclusive={false}>
        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={this.handleClick}
          >
          <Icon name='dropdown' />
          <Header as='h1' textAlign='center'>
            <b>Where can I find Teammates?</b>
          </Header>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
        <Header as='h2' textAlign='left'>
          <Link to='list-participants'>
            <text>List Participants Page</text>
          </Link>
        </Header>
        <p>
          <b>
            You can view/send an invitation to all participants through this
            page!
          </b>
        </p>
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 3}
          index={3}
          onClick={this.handleClick}
          >
          <Icon name='dropdown' />
          <Header as='h1' textAlign='center'>
            <b>How do I Leave/Delete my Team?</b>
          </Header>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 3}>
          <Header as='h2' textAlign='left'>
            <Link to='your-teams'>
              <text>Edit Teams Page</text>
            </Link>
          </Header>
          <p>
            <b>
              Here you can leave, delete, invite, and recruit for your team!
            </b>
          </p>
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 4}
          index={4}
          onClick={this.handleClick}
          >
          <Icon name='dropdown' />
          <Header as='h1' textAlign='center'>
            <b>How do I Create a Team?</b>
          </Header>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 4}>
        <Header as='h2' textAlign='left'>
            <Link to='create-team'>
              <text>Create Teams Page</text>
            </Link>
          </Header>
          <p>
            <b>Make sure to fill out the team creation form fully</b>
          </p>
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 5}
          index={5}
          onClick={this.handleClick}
          >
          <Icon name='dropdown' />
          <Header as='h1' textAlign='center'>
            <b>Can I be on Multiple Teams?</b>
          </Header>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 5}>
        <Header as='h2' textAlign='left' color='green'>
            Yes!
          </Header>
          <p>
            <b>
              Although it is suggested that you stay with one team, you are
              allowed to join multiple teams.
            </b>
          </p>
        </Accordion.Content>
        </Accordion>
        </Grid.Column>
        <Grid.Column>
        <Divider horizontal style={{ paddingTop: '40px' }}>
          UNEXPECTED ERRORS
        </Divider>
        <Accordion fluid styled exclusive={false}>
            <Accordion.Title
            active={activeIndex === 6}
            index={6}
            onClick={this.handleClick}
            >
            <Icon name='dropdown' />
            <Header as='h1' textAlign='center'>
              <b>Site not Functioning Properly?</b>
            </Header>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 6}>
          <Header as='h3' textAlign='left'>
            Please screenshot the problem and direct message cmoore@hawaii.edu
            on Slack
          </Header>
          </Accordion.Content>
        </Accordion>
        </Grid.Column>
      </Grid.Row>
    </Grid>
    </Container>
    );
  }
}

export default HelpPage;
