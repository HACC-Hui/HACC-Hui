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
import { withRouter } from 'react-router';
import swal from 'sweetalert';
import { Container } from 'react-bootstrap';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Tools } from '../../../api/tool/ToolCollection';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class EditToolWidget extends React.Component {
  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(data) {
    const { name, description } = data;

    const id = this.props.doc._id;

    const updateData = {
      id,
      name,
      description,
    };

    const collectionName = Tools.getCollectionName();
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
    const formSchema = new SimpleSchema2Bridge(Tools.getSchema());
    return (
      <Container id="edit-tool-page">
        <h2 className="text-center fw-bold">Edit Tool</h2>
        <AutoForm
          schema={formSchema}
          onSubmit={(data) => this.submit(data)}
          model={this.props.doc}
        >
          <div className="border p-3">
            <TextField name="name" required />
            <LongTextField name="description" required />
            <SubmitField value="Submit" />
            <ErrorsField />
          </div>
        </AutoForm>
      </Container>
    );
  }
}

EditToolWidget.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
};

const EditToolCon = withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  return {
    doc: Tools.findOne(documentId),
  };
})(EditToolWidget);

export default withRouter(EditToolCon);
