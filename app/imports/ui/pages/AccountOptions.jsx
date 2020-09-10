import React from 'react';
import { Grid, Button, Header, Card, Icon, Image, Modal } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { NavLink } from 'react-router-dom';

function AccountOptions() {

    const [open, setOpen] = React.useState(false);
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Account Options</Header>
              <Card fluid>
                  <Image src='https://thepowerofthedream.org/wp-content/uploads/2015/09/generic-profile-picture.jpg'
                         floated='left' size='small' wrapped ui={true} />
                  <Card.Content>
                      <Card.Header>{Meteor.user().username}</Card.Header>
                      <Card.Meta>
                          <span className='date'>Joined (date)</span>
                      </Card.Meta>
                      <Card.Description>
                          User Bio Info
                      </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                      <a>
                          <Icon name='users' />
                          (Team Name Goes Here)
                      </a>
                  </Card.Content>
                  <Card.Content extra>
                      <a>
                          <Icon name='setting' />
                          <Modal
                              open={open}
                              trigger={<Button color='red'>Delete Account</Button>}
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
                                  <Button onClick={() => setOpen(false)}>
                                     Cancel
                                  </Button>
                                  <Button color='red' onClick={() => setOpen(false)}
                                          as={NavLink} exact to ="/deleteform">
                                      Form & Delete
                                  </Button>
                              </Modal.Actions>
                          </Modal>
                      </a>
                  </Card.Content>
              </Card>
          </Grid.Column>
        </Grid>
    );
}

export default AccountOptions;
