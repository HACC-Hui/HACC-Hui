import React from 'react';
import { Header, Grid } from 'semantic-ui-react';
// eslint-disable-next-line no-unused-vars
import { ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';

class profile extends React.Component {
  render() {
    return (
        <div style={{ backgroundColor: '#C4C4C4' }}>
          <Grid container centered>
            <Grid.Column>
              <div className='profileEditBox' style={{ padding: '1rem 5rem', margin: '2rem 0rem' }}>
                <Grid columns={2} relaxed='very' stackable>
                  <Grid.Column width={6}>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Team</Header>
                    </Grid.Row>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">First Name</Header>
                    </Grid.Row>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Last Name</Header>
                    </Grid.Row>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Profile Photo</Header>
                    </Grid.Row>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">About Me</Header>
                    </Grid.Row>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Status</Header>
                    </Grid.Row>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Tools</Header>
                    </Grid.Row>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Skills</Header>
                    </Grid.Row>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Challenges</Header>
                    </Grid.Row>
                  </Grid.Column>
                </Grid>
              </div>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

export default profile;
