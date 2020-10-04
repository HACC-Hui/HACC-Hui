import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router';
import swal from 'sweetalert';
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

    // console.log('EditToolWidget.submit', data);

    const {
      name, description,
    } = data;

    const id = this.props.doc._id;

    const updateData = {
      id, name, description,
    };

    const collectionName = Tools.getCollectionName();
    // console.log(collectionName);
    updateMethod.call({ collectionName: collectionName, updateData: updateData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
            // console.error(error.message);
          } else {
            swal('Success', 'Item edited successfully', 'success');
            // console.log('Success');
          }
        });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    const formSchema = new SimpleSchema2Bridge(Tools.getSchema());
    return (
        <div style={{ backgroundColor: '#C4C4C4' }}>
          <Grid container centered>
            <Grid.Column>
              <div style={{
                backgroundColor: '#393B44', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem',
              }}>
                <Header as="h2" textAlign="center" inverted>Edit Tool</Header>
              </div>
              <AutoForm schema={formSchema} onSubmit={data => this.submit(data)} model={this.props.doc}
                        style={{
                          paddingBottom: '4rem',
                        }}>
                <Segment style={{
                  borderRadius: '1rem',
                  backgroundColor: '#393B44',
                }} className={'teamCreate'}>
                  <Grid container centered>
                    <Grid.Column style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                      <TextField name='name' required/>
                      <LongTextField name='description' required/>
                    </Grid.Column>
                  </Grid>
                  <div align='center'>
                    <SubmitField value='Submit'
                                 style={{
                                   color: 'white', backgroundColor: '#24252B',
                                   margin: '2rem 0rem',
                                 }}/>
                  </div>
                  <ErrorsField/>
                </Segment>
              </AutoForm>
            </Grid.Column>
          </Grid>
        </div>
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
