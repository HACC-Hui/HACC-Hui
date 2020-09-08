import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField,
  SubmitField, TextField, BoolField, LongTextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { stuffDefineMethod } from '../../api/stuff/StuffCollection.methods';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  skills: { type: String },
  tools: { type: String },
  challenges: {
    type: String,
    defaultValue: 'good',
  },
  linkedin: { type: String, optional: true },
  gitHub: { type: String, optional: true },
  website: { type: String, optional: true },
  aboutMe: { type: String, optional: true, max: 200 },
});

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class PostSignUp extends React.Component {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(data, formRef) {
    // console.log('AddStuff.submit', data);
    const { skills, tools, challenges, linkedin, gitHub, website, aboutMe } = data;
    const owner = Meteor.user().username;
    // console.log(`{ ${name}, ${quantity}, ${condition}, ${owner} }`);
    // profile inserts of this information above
    stuffDefineMethod.call({ skills, tools, challenges, owner },
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
            <Header as="h2" textAlign="center">Few More details!</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <TextField name='skills'/>
              </Segment>
              <Segment>
                <TextField name='tools' icon="wrench"/>
              </Segment>
              <Segment>
                <BoolField name='challenges'/>
              </Segment>
              <Segment>
                <TextField name='linkedin' icon="linkedin blue"/>
                <TextField name='gitHub' icon="github"/>
                <TextField name='website'/>
                <LongTextField name='aboutMe'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default PostSignUp;
