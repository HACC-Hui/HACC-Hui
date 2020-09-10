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
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'lodash';
import MultiSelectField from '../controllers/MultiSelectField';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { Interests } from '../../api/interest/InterestCollection';
// import { ChallengeInterests } from '../../api/challenge/ChallengeInterestCollection';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  title: String,
  interests: { type: Array, label: 'interests' },
  'interests.$': { type: String },
  submissionDetail: String,
  pitch: String,
  description: String,
});

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class AddChallenge extends React.Component {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */

  submit(data, formRef) {

    // console.log('AddChallenge.submit', data);

    const {
      title, description, interests, submissionDetail, pitch,
    } = data;

    const interestFilter = (interest) => {
      for (let i = 0; i < interests.length; i++) {
        if (interests[i] === interest.name) {
          return true;
        }
      }
      return false;
    };

    const interestNames = this.props.interests.filter(interestFilter);
    // console.log(interestNames);
    // console.log(_.map(interestNames, 'slugID'));
    const interestSlugs = _.map(interestNames, 'slugID');
    // console.log(interestSlugs);
    const definitionData = {
      title, description, interests: interestSlugs, submissionDetail, pitch,
    };
    const collectionName = Challenges.getCollectionName();
    // console.log(collectionName);
    defineMethod.call({ collectionName: collectionName, definitionData: definitionData },
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
    /*
    const interestsArray = this.props.interests;
    const interestCollectionName = ChallengeInterests.getCollectionName();
    console.log(interests);
    for (let i = 0; i < interestsArray.length; i++) {
      for (let j = 0; j < interests.length; j++) {
        if (interestsArray[i].name === interests[j]) {
          const interestID = interestsArray[i]._id;
          defineMethod.call({ collectionName: interestCollectionName, definitionData: { challengeID, interestID } });
        }
      }
    }
     */
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(schema);
    const interestsArray = _.map(this.props.interests, 'name');
    return (
        <div style={{ backgroundColor: '#C4C4C4' }}>
          <Grid container centered>
            <Grid.Column>
              <div style={{
                backgroundColor: '#393B44', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem',
              }}>
                <Header as="h2" textAlign="center" inverted>Add Challenge</Header>
              </div>
              <AutoForm ref={ref => {
                fRef = ref;
              }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}
                        style={{
                          paddingBottom: '4rem',
                        }}>
                <Segment style={{
                  borderRadius: '1rem',
                  backgroundColor: '#393B44',
                }} className={'teamCreate'}>
                  <Grid container centered>
                    <Grid.Column style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                      <TextField name='title' required/>
                      <LongTextField name='description' required/>
                      <MultiSelectField name='interests' placeholder={'Interests'}
                                        allowedValues={interestsArray} required/>
                      <TextField name='submissionDetail' required/>
                      <TextField name='pitch' required/>
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

AddChallenge.propTypes = {
  interests: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// export default CreateTeam;
export default withTracker(() => {
  const subscription = Interests.subscribe();
  return {
    interests: Interests.find({}).fetch(),
    ready: subscription.ready(),
  };
})(AddChallenge);
