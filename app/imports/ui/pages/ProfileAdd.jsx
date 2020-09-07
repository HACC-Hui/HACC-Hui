import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { demographicLevels } from '../../api/level/Levels';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  username: String,
  slugID: String,
  firstName: String,
  lastName: String,
  demographicLevel: {
    type: String,
    allowedValues: demographicLevels,
    defaultValue: 'N/A' },
  linkedIn: String,
  gitHub: String,
  website: String,
  aboutMe: String,
  userID: { type: SimpleSchema.RegEx.Id, optional: true },
  lookingForTeam: {
    type: Boolean,
    },
  isCompliant: {
    type: Boolean,
    },
  image: {
    type: String,
    defaultValue: '',
  },
  });

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class ProfileAdd extends React.Component {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(data, formRef) {
    // console.log('AddStuff.submit', data);
    const { username, firstName, lastName, demographicLevel, lookingForTeam,
      challenges, interests, skills, tools,
      linkedIn, gitHub, website, aboutMe } = data;
    const userID = Meteor.user().username;
    // console.log(`{ ${name}, ${quantity}, ${condition}, ${owner} }`);
    defineMethod.call({ username, firstName, lastName, demographicLevel, lookingForTeam,
          challenges, interests, skills, tools,
          linkedIn, gitHub, website, aboutMe },
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
            <Header as="h2" textAlign="center">Create Your Profile</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <TextField name='First Name'/>
                <TextField name='Last Name'/>
                <TextField name='Demographic level'/>
                <SelectField name='Looking for a team'/>
                <SelectField name='Challenges'/>
                <SelectField name='Interests'/>
                <SelectField name='Skills'/>
                <SelectField name='Tools'/>
                <SelectField name='Looking for a team'/>
                <TextField name='About Me'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default ProfileAdd;
