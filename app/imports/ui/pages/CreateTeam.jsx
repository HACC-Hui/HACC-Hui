import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField } from 'uniforms-semantic';
import MultiSelectField from '../controllers/MultiSelectField';
import RadioField from '../controllers/RadioField';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { stuffDefineMethod } from '../../api/stuff/StuffCollection.methods';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  name: String,
  quantity: Number,
  availability: {
    type: String,
    allowedValues: ['Yes', 'No'],
  },
  teamName: String,
  image: String,
  challenges: { type: Array, label: 'Challenges', optional: true },
  'challenges.$': { type: String, allowedValues: ['Sustainability', 'Green Energy'] },
  skills: { type: Array, label: 'Skills', optional: true },
  'skills.$': { type: String, allowedValues: ['React', 'Python'] },
  toolsets: { type: Array, label: 'Toolsets', optional: true },
  'toolsets.$': { type: String, allowedValues: ['Graphic Design', 'Sony Vegas'] },
  description: String,
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
    // console.log('CreateTeam.submit', data);
    const { name, quantity, condition } = data;
    const owner = Meteor.user().username;
    // console.log(`{ ${name}, ${quantity}, ${condition}, ${owner} }`);
    stuffDefineMethod.call({ name, quantity, condition, owner },
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
        <div style={{ backgroundColor: '#C4C4C4' }}>
          <Grid container centered>
            <Grid.Column>
              <div style={{ backgroundColor: '#393B44', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem' }}>
                <Header as="h2" textAlign="center" inverted>Team Creation</Header>
              </div>
              <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}
                style={{
                  paddingBottom: '4rem' }}>
                <Segment style={{
                  borderRadius: '1rem',
                  backgroundColor: '#393B44',
                }} className={'teamCreate'}>
                  <Grid columns={2} style={{ paddingTop: '2rem' }}>
                    <Grid.Column style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                      <TextField name='teamName'/>
                      <MultiSelectField name='challenges' placeholder={'Challenges'} required/>
                      <MultiSelectField name='skills' placeholder={'Skills'} required/>
                      <MultiSelectField name='toolsets' placeholder={'Toolsets'} required/>
                    </Grid.Column>
                    <Grid.Column style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                      <RadioField
                          name='availability'
                          inline
                         >
                      </RadioField>
                      <TextField name='image' placeholder={'Team Image URL'}/>
                      <LongTextField name='description'/>
                    </Grid.Column>
                  </Grid>
                  <div align='center'>
                    <SubmitField value='Submit'
                                 style={{ color: 'white', backgroundColor: '#24252B',
                                   margin: '2rem 0rem' }}/>
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

export default CreateTeam;
