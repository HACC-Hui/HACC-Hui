import React from 'react';
import { Header, Grid, Segment, Button } from 'semantic-ui-react';
import { LongTextField, TextField, AutoForm } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../forms/MultiSelectField';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { NavLink } from 'react-router-dom';
/*
import { Developers} from '../../api/user/DeveloperCollection';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { Interests } from '../../api/interest/InterestCollection';
import { Skills } from '../../api/skill/SkillCollection';
import { Tools } from '../../api/tool/ToolCollection';
 */

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
    const owner = Meteor.user().userID;
    updateMethod.call({ firstName, lastName, demographicLevel,
        challenges, interests, skills, tools, aboutMe },
        (error) => (error ?
        swal('Error', error.message, 'error') :
        swal('Success', 'Item updated successfully', 'success')));
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    const eSchema = new SimpleSchema2Bridge(editSchema);
    /*
    const eSchema = new SimpleSchema2Bridge(Develops.getSchema());
    */
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
                    <Button as={NavLink} activeClassName="active" exact to="/UPF"
                            style={{ color: 'white', backgroundColor: '#24252B' }} content="Submit" />
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

/*
editProfile.propTypes = {
  username: PropTypes.array.isRequired,
  lastName: PropTypes.array.isRequired,
  firstName: PropTypes.array.isRequired,
  image: PropTypes.array.isRequired,
  aboutMe: PropTypes.array.isRequired,
  demographicLevel: PropTypes.array.isRequired,
  interests: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};
*/
/*
export default withTracker(() => {
  const subscription = Challenges.subscribe();
  return {
    interests: Interests.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    ready: subscription.ready(),
  };
})(editProfile);
*/

export default editProfile;
