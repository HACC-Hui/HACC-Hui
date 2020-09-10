import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { Interests } from '../../api/interest/InterestCollection';
import MultiSelectField from '../components/form-fields/MultiSelectField';

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
    const { title, description, interests, submissionDetail, pitch } = data;
    const updateData = {
      title,
      description,
      submissionDetail,
      pitch,
    };
    updateMethod.call(updateData, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Item updated successfully', 'success')));
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    const formSchema = new SimpleSchema2Bridge(Challenges.getSchema());
    const interestsArr = this.props.interests.map((interest) => interest.name );

    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Edit Stuff</Header>
            <AutoForm schema={formSchema} onSubmit={data => this.submit(data)} model={this.props.challengeDoc}>
              <Segment>
              <TextField name='title'/>
                <TextField name='submissionDetail'/>
                <TextField name='pitch'/>
                {/* <MultiSelectField name='interests' placeholder={'Interests'}
                                    allowedValues={interestsArr}/> */}
                <LongTextField name='description'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

/** Require the presence of a Challenge document in the props object. Uniforms adds 'model' to the props, which we use. */
EditChallenges.propTypes = {
  challengeDoc: PropTypes.object,
  model: PropTypes.object,
  interests: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Challenges documents.
  const subscription = Challenges.subscribe();
  const subInterests = Interests.subscribe();

  return {
    challengeDoc: Challenges.findOne(documentId),
    interests: Interests.find({}).fetch(),
    ready: subscription.ready() && subInterests.ready(),
  };
})(EditChallenges);
