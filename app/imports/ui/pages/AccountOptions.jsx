import React from 'react';
import { Grid, Button, Header, Card, Icon, Image, Modal } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { usersDeleteMethod } from '../../api/user/AccountOptions.methods';
/**
 * Renders the Page for Account Options. **deprecated**
 * @memberOf ui/pages
 */

class AccountOptions extends React.Component {
    submit = () => {
      usersDeleteMethod.call(Meteor.user().username);
  }

  render() {
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
                              trigger={<Button color='red'>Delete Account</Button>}
                              header='Account Removal Form'
                              content='Before you go please fill out this questionnaire so we can improve the HACC experience in the future.'
                              actions={['Cancel', { key: 'submit', content: 'Submit & Delete', positive: true, onClick: this.submit }]}/>
                      </a>
                  </Card.Content>
              </Card>
          </Grid.Column>
        </Grid>
    );
  }
}

export default AccountOptions;
