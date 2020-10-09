import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Form, Header, Message, Segment } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { AutoForm, BoolField, SubmitField, TextField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { ROUTES } from '../../../startup/client/route-constants';
import { Participants } from '../../../api/user/ParticipantCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { userInteractionDefineMethod } from '../../../api/user/UserInteractionCollection.methods';
import { USER_INTERACTIONS } from '../../../startup/client/user-interaction-constants';
import { darkerBlueStyle } from '../../styles';

const schema = new SimpleSchema({
  lastName: String,
  firstName: String,
  agree: { type: Boolean, optional: false },
});

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class ParticipationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirectToReferer: false };
  }

  submit(formData) {
    const { firstName, lastName, agree } = formData;
    if (agree) {
      const dev = Participants.findDoc({ userID: Meteor.userId() });
      const collectionName = Participants.getCollectionName();
      const updateData = {
        id: dev._id,
        isCompliant: agree,
      };
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          console.error('Could not update Participant', error);
        }
      });
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
  }

  render() {
    const formSchema = new SimpleSchema2Bridge(schema);
    if (this.state.redirectToReferer) {
      const from = { pathname: ROUTES.CREATE_PROFILE };
      return <Redirect to={from}/>;
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
                  <TextField name="firstName" />
                  <TextField name="lastName" />
                </Form.Group>
                <BoolField name="agree" label="I have read the rules and agree to the terms" />
                <SubmitField />
              </Segment>
            </AutoForm>
        </Segment>
    );
  }
}

export default ParticipationForm;
