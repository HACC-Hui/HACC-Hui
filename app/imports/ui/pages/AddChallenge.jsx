import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import MultiSelectField from '../components/form-fields/MultiSelectField';
import { Interests } from '../../api/interest/InterestCollection';
import { Challenges } from '../../api/challenge/ChallengeCollection';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  title: String,
  description: String,
  submissionDetail: String,
  pitch: String,
  interests: { type: Array },
  'interests.$': { type: String }
});

/**
 * Renders the Page for adding challenges. **deprecated**
 * @memberOf ui/pages
 */
class AddChallenge extends React.Component {

  /** On submit, insert the data.
   * @param definitionData {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(definitionData, formRef) {
    // console.log('AddChallenge.submit', definitionData);
    const { title, description, interests, submissionDetail, pitch } = definitionData;
    console.log('line 38')
    let res = defineMethod.call({
        collectionName: Challenges.getCollectionName(), 
        definitionData: { title, description, interests, submissionDetail, pitch },
      },
      (error) => {
        console.log('error');
        if (error) {
          swal('Error', error.message, 'error');
          // console.error(error.message);
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
          // console.log('Success');
        }
      });
    console.log("res = " + res);
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(schema);
    const interestsArr = this.props.interests.map((interest) => interest.name );

    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Add Challenge</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={definitionData => this.submit(definitionData, fRef)} >
              <Segment>
                <TextField name='title'/>
                <TextField name='submissionDetail'/>
                <TextField name='pitch'/>
                <MultiSelectField name='interests' placeholder={'Interests'}
                                    allowedValues={interestsArr}/>
                <LongTextField name='description'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

// Require an array of all of the collections in the props.
AddChallenge.propTypes = {
  interests: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
const AddChallengeContainer = withTracker(() => {
  // Get access to documents.
  const subInterests = Interests.subscribe();

  return {
    interests: Interests.find({}).fetch(),
    ready: subInterests.ready()
  };
})(AddChallenge);

// Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(AddChallengeContainer);