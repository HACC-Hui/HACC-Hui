import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  LongTextField,
  SubmitField,
  NumField,
  SelectField,
  TextField,
} from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Developers } from '../../../api/user/DeveloperCollection';
import { withTracker } from 'meteor/react-meteor-data';



// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  skills: [],
  tools: [],
  Challenge: [],
  Linkend: String,
  GitHub: String,
  Website: String,
  About_Me: String,
  condition: {
    type: String,
    allowedValues: ['excellent', 'good', 'fair', 'poor'],
    defaultValue: 'good',
  },
});

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class Dform extends React.Component {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(data, formRef) {
    const currentUser = Meteor.user() ? Meteor.user().username : '';
    const docID = Meteor.userId();
    const { demeogra, lookingForTeam, challenges, interests, skill,
      tools, linkedIn, gitHub, website, aboutMe, isCompliant } = data;
    Developers.update({ docID, demeogra, lookingForTeam, challenges, interests,
          skill, tools, linkedIn, gitHub, website,aboutMe,isCompliant},
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Item added successfully', 'success');
            formRef.reset();
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
            <Header as="h2" textAlign="center">developer participation form</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <TextField name='name'/>
                <NumField name='quantity' decimal={false}/>
                <SelectField name='condition'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default Dform;
