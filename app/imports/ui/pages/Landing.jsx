import React from 'react';
import { Responsive, Grid, Image, Container, Header, Button, Icon, Segment } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class Landing extends React.Component {
  render() {
    return (
        <Grid rows={'equal'}>
          <Grid.Row style={{ margin: 50 }}>
            <Grid.Column width={8} style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
            }}>
              <b style={{
                color: '#0B2C52', fontSize: 30, alignSelf: 'flex-start',
                paddingLeft: 20, marginBottom: 15,
              }}>Welcome to HACC-Hui</b>
                  <p style={{ fontSize: 20, paddingLeft: 20, color: '#0B2C52' }}>
                    Our goal is to simplify team formation and ongoing team management
                    for the Hawaii Annual Code Challenge.
                    <br />
                    <br />
                    Here you can create a new team or join an already made one.
                      Our application can help you find the perfect team for you,
                      or help you look for members that fit your team’s requirements.
                  </p>
              </Grid.Column>
            <Grid.Column width={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Image centered size='medium' src="/images/hacc.png"/>
              </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ backgroundColor: '#E5F0FE' }}>
            <Grid.Column width={8} style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
              <Image centered size='small' src="/images/profile8.png"/>
              <b style={{ fontSize: 30, fontStyle: 'italic', margin: 15 }}>
                Develop your profile
              </b>
              <p style={{ fontSize: 20, fontStyle: 'italic' }}>
                Create your profile to participate in HACC
              </p>
            </Grid.Column>
            <Grid.Column width={8} style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
              <Image centered size='small' src="/images/team.png"/>
              <b style={{ fontSize: 30, fontStyle: 'italic', margin: 15 }}>
                Create a team
              </b>
              <p style={{ fontSize: 20, fontStyle: 'italic' }}>
                Create your team to solve a challenge and win the HACC
              </p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ backgroundColor: '#E5F0FE' }}>
            <Grid.Column width={8} style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
              <Image centered size='small' src="/images/join.png"/>
              <b style={{ fontSize: 30, fontStyle: 'italic', margin: 15 }}>
                Join a team
              </b>
              <p style={{ fontSize: 20, fontStyle: 'italic' }}>
                Find a team to join and tackle a challenge together
              </p>
            </Grid.Column>
            <Grid.Column width={8} style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
              <Image centered size='small' src="/images/slackicon.png"/>
              <b style={{ fontSize: 30, fontStyle: 'italic', margin: 15 }}>
                Utilize Slack
              </b>
              <p style={{ fontSize: 20, fontStyle: 'italic' }}>
                Communicate with your team through Slack
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
    );
  }
}

export default Landing;
