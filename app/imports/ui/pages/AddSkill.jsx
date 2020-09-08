import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { stuffDefineMethod } from '../../api/stuff/StuffCollection.methods';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  skill: String,
});

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class AddSkill extends React.Component {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(data, formRef) {
    // console.log('AddStuff.submit', data);
    const { skill } = data;
    // console.log(`{ ${name}, ${quantity}, ${condition}, ${owner} }`);
    stuffDefineMethod.call({ skill },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
          // console.error(error.message);
        } else {
          swal('Success', 'Item added successfully', 'success');
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
            <Header as="h2" textAlign="center">Add a Skill</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <TextField name='skill'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default AddSkill;
