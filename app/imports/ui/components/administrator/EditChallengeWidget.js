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
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { _ } from 'lodash';
import SimpleSchema from 'simpl-schema';
import { withRouter } from 'react-router';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import MultiSelectField from '../form-fields/MultiSelectField';
import { Interests } from '../../../api/interest/InterestCollection';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */

const schema = new SimpleSchema({
  title: String,
  interests: { type: Array, label: 'interests' },
  'interests.$': { type: String },
  submissionDetail: String,
  pitch: String,
  description: String,
});
class EditChallengeWidget extends React.Component {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(data) {

    const {
      description, interests, submissionDetail, pitch,
    } = data;
    const id = this.props.doc._id;

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
    const interestSlugs = _.map(interestNames, '_id');
    console.log(interestSlugs);
    const updateData = {
      id, description, interestIDs: interestSlugs, submissionDetail, pitch,
    };
    const collectionName = Challenges.getCollectionName();
    console.log(updateData);
    updateMethod.call({ collectionName: collectionName, updateData: updateData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
            // console.error(error.message);
          } else {
            swal('Success', 'Item edited successfully', 'success');
            // console.log('Success');
          }
        });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
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
                <Header as="h2" textAlign="center" inverted>Edit Challenge</Header>
              </div>
              <AutoForm schema={formSchema} onSubmit={data => this.submit(data)} model={this.props.doc}
                        style={{
                          paddingBottom: '4rem',
                        }}>
                <Segment style={{
                  borderRadius: '1rem',
                  backgroundColor: '#393B44',
                }} className={'teamCreate'}>
                  <Grid container centered>
                    <Grid.Column style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
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

EditChallengeWidget.propTypes = {
  interests: PropTypes.array.isRequired,
  doc: PropTypes.object,
  model: PropTypes.object,
};

const EditChallengeCon = withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  return {
    doc: Challenges.findOne(documentId),
    interests: Interests.find({}).fetch(),
  };
})(EditChallengeWidget);

export default withRouter(EditChallengeCon);
