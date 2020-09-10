import React from 'react';
<<<<<<< HEAD
import { Header, Grid, Button } from 'semantic-ui-react';
// eslint-disable-next-line no-unused-vars
import { ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
=======
import { Header, Grid, Button, Dropdown } from 'semantic-ui-react';
// eslint-disable-next-line no-unused-vars
import { ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import { NavLink } from 'react-router-dom';
>>>>>>> iss4secret

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class profile extends React.Component {
  render() {
    return (
        <div style={{ backgroundColor: '#C4C4C4' }}>
          <Grid container centered>
            <Grid.Column>
              <div className='profileBox' style={{ padding: '1rem 5rem', margin: '2rem 0rem' }}>
                <Grid columns={2} relaxed='very' stackable>
                  <Grid.Column width={6}>
                    <div className='innerProfileBox' style={{ padding: '1rem 5rem', margin: '2rem 0rem',
                      borderRadius: '2Rem' }}>
                      <Grid columns={8} divided>
                        <Grid.Row centered>
                          <Header inverted as="h3" textAlign="center">Team</Header>
                        </Grid.Row>
                        <Grid.Row centered>
                          <Header inverted as="h3" textAlign="center">Profile Image</Header>
                        </Grid.Row>
                        <Grid.Row centered>
                          <Header inverted as="h3" textAlign="center">Name</Header>
                        </Grid.Row>
                        <Grid.Row centered>
                          <Header inverted as="h3" textAlign="center">Status</Header>
                        </Grid.Row>
                        <Grid.Row centered>
                          <Header inverted as="h3" textAlign="center">Links</Header>
                        </Grid.Row>
                        <Grid.Row centered>
                          <Header inverted as="h3" textAlign="center">Challenges</Header>
                        </Grid.Row>
                        <Grid.Row centered>
                          <Header inverted as="h3" textAlign="center">Challenge1</Header>
                        </Grid.Row>
                        <Grid.Row centered>
                          <Header inverted as="h3" textAlign="center">Challenge2</Header>
                        </Grid.Row>
                      </Grid>
                    </div>
                  </Grid.Column>
                  <Grid.Column width={10}>
<<<<<<< HEAD
                    <Button color='grey' floated='right'>EDIT</Button>
=======
                    <Button color='grey' floated='right' as={NavLink} exact to="/deleteAccount">EDIT</Button>
>>>>>>> iss4secret
                    <Grid className="info">
                      <Grid.Row>
                        <Header inverted as="h3">About ME</Header>
                        <p>mi ipsum faucibus vitae aliquet nec ullamcorper sit amet risus nullam
                          eget felis eget nunc lobortis mattis aliquam faucibus purus in massa tempor
                          nec feugiat nisl pretium fusce id velit ut tortor pretium viverra suspendisse
                          potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus
                          sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus est</p>
                      </Grid.Row>
                      <Grid divided="vertically">
                        <Grid.Column columns={2}>
                          <Grid.Column>
                            <Header inverted as="h3" textAlign="center">Tools</Header>
                            <p>Experienced:
                              Video Editing
                              Graphic Design
                              Novice:
                              Video Editing
                              Graphic Design
                              Dont know, but would like to learn:
                              Video Editing
                              Graphic Design
                            </p>
                          </Grid.Column>
                          <Grid.Column>
                            <Header inverted as="h3" textAlign="center">Skills</Header>
                            <p>Experienced:
                              Video Editing
                              Graphic Design
                              Novice:
                              Video Editing
                              Graphic Design
                              Dont know, but would like to learn:
                              Video Editing
                              Graphic Design
                            </p>
                          </Grid.Column>
                        </Grid.Column>
                      </Grid>
                    </Grid>
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
