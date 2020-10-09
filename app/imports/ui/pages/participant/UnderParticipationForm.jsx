import React from 'react';
import { Button, Form, Header, Message, Segment } from 'semantic-ui-react';
import { NavLink, Redirect } from 'react-router-dom';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { ROUTES } from '../../../startup/client/route-constants';
import { darkerBlueStyle } from '../../styles';
import { Participants } from '../../../api/user/ParticipantCollection';
import { USER_INTERACTIONS } from '../../../startup/client/user-interaction-constants';
import { userInteractionDefineMethod } from '../../../api/user/UserInteractionCollection.methods';
import { AutoForm, SubmitField, TextField } from 'uniforms-semantic';

const schema = new SimpleSchema({
  yourLastName: String,
  yourFirstName: String,
  parentFirstName: String,
  parentLastName: String,
  parentEmail: String,
});

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class UnderParticipationForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = { redirectToReferer: false };
  }

  submit(formData) {
    const { firstName, lastName, parentFirstName, parentLastName, parentEmail } = formData;
    const dev = Participants.findDoc({ userID: Meteor.userId() });
    const interactionData = {
      username: dev.username,
      type: USER_INTERACTIONS.SIGNED_CONSENT,
      typeData: [firstName, lastName],
    };
    console.log(interactionData);
    userInteractionDefineMethod.call(interactionData, (error) => {
      if (error) {
        console.error('Could not define user interaction', error);
      }
    });
    this.setState({ redirectToReferer: true });
  }

  render() {
    const formSchema = new SimpleSchema2Bridge(schema);
    if (this.state.redirectToReferer) {
      const from = { pathname: ROUTES.CREATE_PROFILE };
      return <Redirect to={from} />;
    }
    return (
        <Segment style={darkerBlueStyle}>
          <Header>HACC Registration</Header>
          <AutoForm schema={formSchema} onSubmit={data => this.submit(data)}>
            <Segment>
              <Message>
                Read the <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>.
                <br />
                Then agree to the terms.
              </Message>
              <Form.Group widths="equal">
                <TextField name='yourFirstName' />
                <TextField name='yourLastName' />
              </Form.Group>
              <Form.Group widths="equal">
                <TextField name='parentFirstName' label="Parent/Guardian First Name" />
                <TextField name='parentLastName' label="Parent/Guardian Last Name" />
                <TextField name='parentEmail' label="Parent/Guardian Email" />
              </Form.Group>
              <SubmitField />
            </Segment>
          </AutoForm>
        </Segment>
    );
  }
}

export default UnderParticipationForm;
