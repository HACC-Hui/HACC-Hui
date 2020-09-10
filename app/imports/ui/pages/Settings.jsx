import React from 'react';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import { Header, Button, Container, Segment, Divider,
  Popup, Checkbox, Form, TextArea } from 'semantic-ui-react';
import { accountDeleteMethod, developerDeleteMethod } from '../../startup/both/Methods';

/**
 * After the user clicks the "Signout" link in the NavBar, log them out and display this page.
 * @memberOf ui/pages
 */
class Settings extends React.Component {

   /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */

  constructor(props) {
    super(props);
    this.state = { redirectToReferer: false };
  }

  submit() {
    // console.log('AddStuff.submit', data);
    // const { team, challange, other } = data;
    // const owner = Meteor.user().username;
    // console.log(`{ ${team}, ${challange}, ${other}, ${owner} }`);
    // to delete whole account accountDeleteMethod
    // to delete developer account developerDeleteMethod
    Meteor.call(accountDeleteMethod,
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Account Deleted', 'success');
          this.setState({ redirectToReferer: true });
          // console.log('Success');
        }
      });
  }

  render() {
    const { from } = { from: { pathname: '/signin' } };
    if (this.state.redirectToReferer) {
      return <Redirect to={from}/>;
    }
    // otherwise render form again
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
                <Form onSubmit={this.submit}>
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
                <Divider hidden/>
            </Popup>
        </Segment>
    </Container>
    );
  }
}

export default Settings;
