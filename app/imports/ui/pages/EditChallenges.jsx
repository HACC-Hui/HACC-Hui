import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { Interests } from '../../api/interest/InterestCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

const editChallengeSchema = new SimpleSchema({
  title: { type: String },
  slugID: { type: SimpleSchema.RegEx.Id },
  interests: {
    type: String,
    allowedValues: ['Community Engagement', 'Sustainability', 'Education'],
    defaultValue: 'Community Engagement',
  },
  description: { type: String },
  submissionDetail: { type: String },
  pitch: { type: String },
});

/**
 * Renders the Page for editing a single document.
 * @memberOf ui/pages
 */
class EditChallenges extends React.Component {
  /**
   * On successful submit, insert the data.
   * @param data {Object} the result from the form.
   */
  submit(data) {
    // console.log(data);
    const { title, description, interests, submissionDetail, pitch, _id } = data;
    const chosenInterest = Interests.findDoc(interests);
    const interestIDs = [chosenInterest._id];
    const updateData = {
      _id,
      title,
      description,
      interestIDs,
      submissionDetail,
      pitch,
    };
    updateMethod.call({ collectionName: Challenges.getCollectionName(), updateData: updateData }, (error) => (error ?
        swal('Error', error.message, 'error') :
        swal('Success', 'Challenge updated successfully', 'success')));
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {

    const formSchema = new SimpleSchema2Bridge(editChallengeSchema);
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Edit Challenges</Header>
            <AutoForm schema={formSchema} onSubmit={data => this.submit(data)} model={this.props.doc}>
              <Segment>
                <TextField name='title'/>
                <TextField name='description'/>
                <SelectField name='interests'/>
                <TextField name='submissionDetail'/>
                <TextField name='pitch'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

/** Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use. */
EditChallenges.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  const subscription = Challenges.subscribe();
  return {
    doc: Challenges.findOne(documentId),
    ready: subscription.ready(),
  };
})(EditChallenges);
