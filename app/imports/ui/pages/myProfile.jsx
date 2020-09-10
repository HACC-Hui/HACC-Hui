import React from 'react';
import { Header, Grid, Button, Image, Card, Icon, Modal} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */


function myProfile() {
  const [open, setOpen] = React.useState(false)
  return (
      <div style={{ backgroundColor: '#C4C4C4' }}>
        <Grid container centered>
          <Grid.Column>
            <div className='profileBox' style={{ padding: '1rem 5rem', margin: '2rem 0rem' }}>
              <Card centered>
                <Image/>
                <Card.Content>
                  <Card.Header>Name</Card.Header>
                  <Card.Meta>
                    <span className='date'>Joined in 2015</span>
                  </Card.Meta>
                  <Card.Description>
                    Matthew is a musician living in Nashville.
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name='user' />
                    22 Friends
                  </a>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name='setting' />
                    <Modal
                        open={open}
                        trigger={<Button className="negative ui button">Delete Account</Button>}
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                    >
                      <Modal.Header>Account Removal Form</Modal.Header>
                      <Modal.Content>
                        <p>
                          {/* eslint-disable-next-line max-len */}
                          Before you go please fill out this questionnaire so we can improve the HACC experience in the future.
                        </p>
                      </Modal.Content>
                      <Modal.Actions>
                        <Button color='red' onClick={() => setOpen(false)}>
                          <Icon name='remove' /> Cancel
                        </Button>
                        <Button color='green' onClick={() => setOpen(false)} as={NavLink} exact to ="/Deletion">
                          <Icon name='checkmark' /> Form & Delete
                        </Button>
                      </Modal.Actions>
                    </Modal>
                  </a>
                </Card.Content>
              </Card>
            </div>
          </Grid.Column>
        </Grid>
      </div>
  );
}

export default myProfile;
