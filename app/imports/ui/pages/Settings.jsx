import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Header, Button, Container, Segment, Popup, Checkbox, Form, TextArea } from 'semantic-ui-react';

/**
 * After the user clicks the "Signout" link in the NavBar, log them out and display this page.
 * @memberOf ui/pages
 */
class Settings extends React.Component {
  render() {
    return (
    <Container textAlign="center">
      <Header as="h1" textAlign="center">
        <p>Settings</p>
      </Header>
      <Segment textAlign="center">
          <Header as="h2" color='grey' textAlign="center"> Preferences</Header>
          <p>some stuff</p>
        </Segment>
        <Segment textAlign="center">
            <Header as="h2" color='grey' textAlign="center"> Security </Header>
            <p>some stuff</p>
        </Segment>
        <Segment textAlign="center">
            <Header as="h2" color='grey' textAlign="center"> Delete account</Header>
            <p> You must first exit the team(s) are are a member of to delete your account</p>
            <Popup trigger={<Button color='red'>Delete Account</Button>} on='click' 
                position='right center' 
                flowing hoverable
            >
                <Form>
                    <Form.Field
                    control={Checkbox}
                    label='Could not find a suitable team'
                    />
                    <Form.Field
                    control={Checkbox}
                    label='No challenge was interesting'
                    />
                    <Form.Field
                    control={TextArea}
                    label='Other Reasons'
                    placeholder='Tell us why your are leaving...'
                    />
                    <Form.Field control={Button}>Submit</Form.Field>
                </Form>
            </Popup>
        </Segment>
    </Container>
    );
  }
}

export default Settings;
