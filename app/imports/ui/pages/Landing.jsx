import React from 'react';
import { Grid, Container, Image } from 'semantic-ui-react';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class Landing extends React.Component {
  render() {
    return (
          <Grid columns={'equal'}>
              <Grid.Column width={8} >
                <Grid.Row style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                <h1 style={{ color: '#0B2C52' }}>Welcome to HACC-Hui</h1>
                <p style={{ paddingLeft: 20, color: '#0B2C52' }}>
                  Our goal is to simplify team formation and ongoing team management
                  for the Hawaii Annual Code Challenge.
                  <br />
                  <br />
                  Here you can create a new team or join an already made one.
                  Our application can help you find the perfect team for you, or help you look for members that fit your team’s requirements.
                </p>
                </Grid.Row>
                <Grid rows={'equal'}>
                <Grid.Row style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10, paddingTop: 20, paddingLeft: 50, paddingRight: 50 }}>
                  <Grid.Column width={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%' }}>
                    <Image size='mini' src="/images/slack.png"/>
                    <b style={{ color: '#0B2C52' }}>Slack Support</b>
                    <p style={{ color: '#0B2C52' }}>
                      Contact teams you’re interest in joining, or users you are interested in inviting.
                    </p>
                  </Grid.Column>
                  <Grid.Column width={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%' }}>
                    <Image size='mini' src="/images/document.png"/>
                    <b style={{ color: '#0B2C52' }}>Member Profile</b>
                    <p style={{ color: '#0B2C52' }}>
                      Create a detailed member profile to show propspective teams your skills or view user profiles to find the best teammate for your team.
                    </p>
                  </Grid.Column>
                </Grid.Row>
                </Grid>
              </Grid.Column>
            <Grid.Column width={8} centered style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Image centered size='medium' src="/images/hacc.png"/>
            </Grid.Column>
          </Grid>
    );
  }
}

export default Landing;
