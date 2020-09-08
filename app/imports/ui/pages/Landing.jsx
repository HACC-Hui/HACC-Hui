import React from 'react';
import { Responsive, Grid, Image, Container, Header, Button, Icon, Segment } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class Landing extends React.Component {
  state = {
    log: [],
    logCount: 0,
  }

  handleOnUpdate = (e) => {
    this.setState((prevState) => ({
      log: [
        `${new Date().toLocaleTimeString()}: onUpdate()`,
        ...prevState.log,
      ].slice(0, 20),
      logCount: prevState.logCount + 1,
    }));
    console.log(`e.currentTarget.innerWidth = ${e.currentTarget.innerWidth}`);
    // eslint-disable-next-line no-undef
    console.log(`window.innerWidth = ${window.innerWidth}`);

  }



  render() {

    const gridh3Style = {
      marginTop: 5,
    }
    const gridDivImgStyle = {
      display: 'flex',
      // padding: '2rem 0',
      // width: '100%',
      height: 150,
    }

    return (
      <div>
        <Segment
            textAlign='center'
            className='landing-banner-segment'
            vertical
        >
          <Container>
            <Header
              as='h1'
              content="Hawai'i Annual Coding Challenge"
              className="landing-banner-title"
            />
            <Header
                as='h2'
                content='Where Innovation Starts'
                className='landing-banner-subtitle'
            />
            <Button className='button-v1' size='huge' as={NavLink} exact to="/signin">
              Register
            </Button>
          </Container>
        </Segment>
        <Segment style={{ padding: '2em 0em', backgroundColor: '#25C2A0', }} vertical>
          <Grid stackable container >     
            <Grid.Row textAlign='center' columns={3}>
              <Grid.Column>
                <div style={gridDivImgStyle}>
                  <Image size='small' src="/images/hacc.png" centered/>
                </div>
                <h3 style={gridh3Style}>Supporting HACC 2020</h3>
                <p>Simplifying team formation and ongoing team management.</p>
              </Grid.Column>
              <Grid.Column>
                <div style={gridDivImgStyle}>
                  <Image size='small' src="/images/meteor-logo-v1.svg" centered/>
                </div>
                <h3 style={gridh3Style}>Powered by Meteor</h3>
                <p>HACC Hui a Meteor-based web application with a MongoDB backend. The UI will be mobile first.</p>              
              </Grid.Column>
              <Grid.Column>
                <div style={gridDivImgStyle}>
                  <Image size='small' src="/images/slack-logo.svg" centered/>
                </div>                
                <h3 style={gridh3Style}>Communicate with Slack</h3>
                <p>A Slackbot that provides a communication channel between the HACC Slack Workspace and the HACC Hui application.</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    );
  }
}

export default Landing;
