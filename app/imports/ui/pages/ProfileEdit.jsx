import React from 'react';
import { Header, Grid, Segment } from 'semantic-ui-react';
import { LongTextField, TextField, AutoForm } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../forms/MultiSelectField';
import { stuffDefineMethod } from '../../api/stuff/StuffCollection.methods';

const editSchema = new SimpleSchema({
  team: String,
  fName: String,
  lName: String,
  pPhoto: { type: String, defaultValue: '' },
  aboutMe: { type: String, defaultValue: '' },
  demo: {
    type: Array,
    defaultValue: [' '],
  },
  'demo.$': {
    type: String, allowedValues: ['High-school Student', 'University Student', 'Grad Student'],
  },
  tool: {
    type: Array,
    defaultValue: [' '],
  },
  'tool.$': {
    type: String, allowedValues: ['JavaScript', 'React', 'Python', 'Java', 'C', 'Ruby'],
  },
  skill: {
    type: Array,
    defaultValue: [' '],
  },
  'skill.$': {
    type: String, allowedValues: ['Graphic Design', 'Sony Vegas'],
  },
  challenges: {
    type: Array,
    defaultValue: [' '],
  },
  'challenges.$': {
    type: String, allowedValues: ['Sustainability', 'Green Energy'],
  },
});

class editProfile extends React.Component {

  /**
   * On successful submit, insert the data.
   * @param data {Object} the result from the form.
   */
  submit(data) {
    // console.log(data);
    const { challenges, skills, tools, interests, aboutMe, demographicLevel, firstName, lastName } = data;
    const owner = Meteor.user().username;
    stuffDefineMethod.call({ firstName, lastName, demographicLevel,
        challenges, interests, skills, tools, aboutMe },
        (error) => (error ?
        swal('Error', error.message, 'error') :
        swal('Success', 'Item updated successfully', 'success')));
  }

  render() {
    const eSchema = new SimpleSchema2Bridge(editSchema);
    let fRef = null;
    return (
        <div style={{ backgroundColor: '#24252B' }}>
          <Grid container centered>
            <Grid.Column>
              <AutoForm ref={ref => { fRef = ref; }} schema={eSchema} onSubmit={data => this.submit(data, fRef)}>
              <div className='profileEditBox' style={{ padding: '1rem 5rem', margin: '2rem 0rem' }}>
                <Segment style={{
                  borderRadius: '1rem',
                  backgroundColor: '#393B44',
                }}>
                <Grid>
                  <Grid.Column>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Team</Header>
                      <TextField name='team'/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">First Name</Header>
                      <TextField name='fName'/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Last Name</Header>
                      <TextField name='lName'/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Profile Photo</Header>
                      <TextField name='pPhoto'/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">About Me</Header>
                      <LongTextField name='aboutMe'/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Demographic</Header>
                      <MultiSelectField name='demo'/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Tools</Header>
                      <MultiSelectField name='tool'/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Skills</Header>
                      <MultiSelectField name='skill'/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Challenges</Header>
                      <MultiSelectField name='challenges'/>
                    </Grid.Row>
                    <br/>
                  </Grid.Column>
                </Grid>
              </Segment>
              </div>
              </AutoForm>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

export default editProfile;
