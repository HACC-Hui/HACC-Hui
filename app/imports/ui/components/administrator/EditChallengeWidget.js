import React from 'react';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
} from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import SimpleSchema from 'simpl-schema';
import { withRouter } from 'react-router';
import { Container } from 'react-bootstrap';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */

const schema = new SimpleSchema({
  title: String,
  submissionDetail: String,
  pitch: String,
  description: String,
});

class EditChallengeWidget extends React.Component {
  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(data) {
    const { description, submissionDetail, pitch } = data;
    const id = this.props.doc._id;

    const updateData = {
      id,
      description,
      submissionDetail,
      pitch,
    };
    const collectionName = Challenges.getCollectionName();
    // console.log(updateData);
    updateMethod.call(
      { collectionName: collectionName, updateData: updateData },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item edited successfully', 'success');
        }
      },
    );
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
      <Container id="edit-challenge-page">
        <h2 className="text-center fw-bold">Edit Challenge</h2>
        <AutoForm
          schema={formSchema}
          onSubmit={(data) => this.submit(data)}
          model={this.props.doc}
        >
          <div className="border p-3">
            <LongTextField name="description" required />
            <TextField name="submissionDetail" required />
            <TextField name="pitch" required />
            <SubmitField value="Submit" />
            <ErrorsField />
          </div>
        </AutoForm>
      </Container>
    );
  }
}

EditChallengeWidget.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
};

const EditChallengeCon = withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  return {
    doc: Challenges.findOne(documentId),
  };
})(EditChallengeWidget);

export default withRouter(EditChallengeCon);
