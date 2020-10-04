import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SelectField } from 'uniforms-semantic';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Participants } from '../../../api/user/ParticipantCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { deleteAccountMethod, userInteractionDefineMethod } from '../../../api/user/UserInteractionCollection.methods';
import { USER_INTERACTIONS } from '../../../startup/client/user-interaction-constants';

/**
 * Renders the Page for deleting a user. **deprecated**
 * @memberOf ui/pages
 */
class DeleteForm extends React.Component {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   */
  submit(data) {
    const username = this.props.doc.username;
    const type = USER_INTERACTIONS.DELETE_ACCOUNT;
    const typeData = [data.feedback, data.other];
    const userInteraction = {
      username,
      type,
      typeData,
    };
    userInteractionDefineMethod.call(userInteraction, (error) => (error ?
            swal('Error', error.message, 'error') :
            swal('Account deleted', 'We hope to see you again!', 'success')
                .then(() => {
                  // eslint-disable-next-line no-undef
                  window.location = '/';
                  // Meteor.logout();
                })
    ));
    const collectionName = Participants.getCollectionName();
    const instance = this.props.doc._id;
    // console.log(collectionName, instance);
    removeItMethod.call({ collectionName, instance });
    deleteAccountMethod.call();
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    const reasons = [
      'No challenge was interesting for me',
      'The challenges were too hard',
      "Couldn't find a team I liked being on",
      'My schedule conflicts with the HACC',
      'Other',
    ];
    // Create a schema to specify the structure of the data to appear in the form.
    const schema = new SimpleSchema({
      feedback: {
        type: String,
        allowedValues: reasons,
        defaultValue: 'Other',
      },
      other: { type: String, required: false },
    });
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Feedback</Header>
            <AutoForm schema={formSchema} onSubmit={data => {
              swal({
                text: 'Are you sure you want to delete your account?',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
              })
                  .then((willDelete) => {
                    if (willDelete) {
                      this.submit(data);
                    } else {
                      swal('Canceled deleting your account');
                    }
                  });
            }}>
              <Segment>
                <Header as="h3">We&apos;re sorry to hear you&apos;re deleting your account.</Header>
                <Header as="h4">Please provide feedback on why you&apos;re leaving
                  to improve the HACC experience for next year.</Header>
                <br/>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <SelectField name='feedback'/>
                    </Grid.Column>
                    <Grid.Column>
                      <LongTextField name='other'/>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Button basic color='red' value='submit'>
                  Delete Account
                </Button>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

/**
 * Require the presence of a DeleteForm document in the props object. Uniforms adds 'model' to the props, which we
 * use.
 */
DeleteForm.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Participants documents.
  const subscription = Participants.subscribe();
  return {
    doc: Participants.findOne(documentId),
    ready: subscription.ready(),
  };
})(DeleteForm);
