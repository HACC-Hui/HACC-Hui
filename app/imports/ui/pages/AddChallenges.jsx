import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  title: String,
  description: String,
  submissionDetail: String,
  pitch: String,
});

/**
 * Renders the Page for adding Challenge. **deprecated**
 * @memberOf ui/pages
 */
class AddChallenge extends React.Component {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(data, formRef) {
    // console.log('AddChallenge.submit', data);
    const { title, description, interestIDs, submissionDetail, pitch, _id } = data;
    const definitionData = {
      _id,
      title,
      description,
      interestIDs,
      submissionDetail,
      pitch,
    };
    defineMethod.call({ collectionName: Challenges.getCollectionName(), definitionData: definitionData }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
        // console.error(error.message);
      } else {
        swal('Success', 'Challenge added successfully', 'success');
        formRef.reset();
        // console.log('Success');
      }
    });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Add Challenge</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <TextField name='title'/>
                <TextField name='description'/>
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

export default AddChallenge;
