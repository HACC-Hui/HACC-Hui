import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
  HiddenField,
} from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../controllers/MultiSelectField';
import RadioField from '../controllers/RadioField';
import { Teams } from '../../api/team/TeamCollection';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  teamName: String,
  image: String,
  description: String,
  challenges: { type: Array, label: 'Challenges' },
  'challenges.$': { type: String, allowedValues: ['Placeholder1', 'Placeholder2'] },
  skills: { type: Array, label: 'Skills' },
  'skills.$': { type: String, allowedValues: ['Placeholder1', 'Placeholder2'] },
  tools: { type: Array, label: 'Tools' },
  'tools.$': { type: String, allowedValues: ['Placeholder1', 'Placeholder2'] },
  owner: String,
  availability: {
    type: String,
    allowedValues: ['Open', 'Closed'],
  },
});

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class CreateTeam extends React.Component {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(data, formRef) {
    console.log('CreateTeam.submit', data);
    const {
      teamName, description, gitHubRepo = '', devPostPage = '',
      owner, open = true, challenges, skills, tools, developers = [],
    } = data;

    const docID = Teams.define({
      teamName, description, open, owner, gitHubRepo,
      devPostPage, challenges, tools, skills,
    });
    // console.log(`{ ${name}, ${quantity}, ${condition}, ${owner} }`);
    /* teamsDefineMethod.call({ name, quantity, condition, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
          // console.error(error.message);
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
          // console.log('Success');
        }
      }); */
  }

  /* Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Create a Team</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <TextField name='teamName'/>
                <RadioField name='availability'/>
                <MultiSelectField name='challenges' placeholder={'Challenges'} required/>
                <MultiSelectField name='skills' placeholder={'Skills'} required/>
                <MultiSelectField name='tools' placeholder={'Tools'} required/>
                <TextField name='image' placeholder={'Image URL'}/>
                <LongTextField name='description'/>
                <SubmitField value='Submit'/>
                <HiddenField name='owner' value={Meteor.user().username}/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default CreateTeam;
