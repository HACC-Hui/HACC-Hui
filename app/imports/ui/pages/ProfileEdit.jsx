import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
} from 'uniforms-semantic';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'lodash';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../controllers/MultiSelectField';
import { Teams } from '../../api/team/TeamCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
// import { demographicLevel } from '../api/level/Levels';
import { Skills } from '../../api/skill/SkillCollection';
import { Tools } from '../../api/tool/ToolCollection';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { Developers } from '../../api/user/DeveloperCollection';

const editSchema = new SimpleSchema({
  team: String,
  fName: String,
  lName: String,
  image: String,
  aboutMe: String,
  linkedIn: String,
  gitHub: String,
  website: String,
  demographicLevel: {
    type: Array,
    label: [' Demographic Level'],
  },
  'demographicLevel.$': {
    type: String,
  },
  tools: {
    type: Array, label: 'Toolsets' },
  'tools.$': {
    type: String,
  },
  skills: {
    type: Array,
    label: 'Skills' },
  'skills.$': {
    type: String,
  },
  challenges: {
    type: Array,
    label: 'Challenges',
  },
  'challenges.$': {
    type: String,
  },
});

class editProfile extends React.Component {

  /**
   * On successful submit, insert the data.
   * @param data {Object} the result from the form.
   */
  submit(data, formRef) {
     console.log(data);

    const owner = this.props.developer[0].slugID;
  //  const demographicLevelP = this.props.demographicLevel;
   // const demographicLevelOb = [];
    const skillsP = this.props.skills;
    const skillsOb = [];
    const toolsP = this.props.tools;
    const toolsOb = [];
    const ChallengesP = this.props.challenges;
    const ChallengesOb = [];

    const {
      challenges, skills, tools, aboutMe, website, demographicLevel, gitHub, linkedIn, firstName, lastName, image,
    } = data;

    for (let i = 0; i < toolsP.length; i++) {
      for (let j = 0; j < tools.length; j++) {
        if (toolsP[i].name === tools[j]) {
          toolsOb.push(toolsP[i].slugID);
        }
      }
    }
    for (let i = 0; i < skillsP.length; i++) {
      for (let j = 0; j < skills.length; j++) {
        if (skillsP[i].name === skills[j]) {
          skillsOb.push(skillsP[i].slugID);
        }
      }
    }
    for (let i = 0; i < ChallengesP.length; i++) {
      for (let j = 0; j < challenges.length; j++) {
        if (ChallengesP[i].name === tools[j]) {
          ChallengesOb.push(ChallengesP[i].slugID);
        }
      }
    }
    defineMethod.call({
          collectionName: Teams.getCollectionName(),
          definitionData: {
            demographicLevel,
            aboutMe,
            owner,
            firstName,
            lastName,
            image,
            website,
            gitHub,
            linkedIn,
          //  demographicLevelOb,
            ChallengesOb,
            skillsOb,
            toolsOb,
          },
        },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
            console.error(error.message);
          } else {
            swal('Success', 'Team created successfully', 'success');
            formRef.reset();
            console.log('Success');
          }
        });
  }

  render() {
    const eSchema = new SimpleSchema2Bridge(editSchema);
    const skillsP = _.map(this.props.skills, 'name');
    const toolsP = _.map(this.props.tools, 'name');
    const ChallengesP = _.map(this.props.challenges, 'title');
  //  const demographicLevelP = _.map(this.props.demographicLevel, 'title');
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
                      <TextField name='team' required/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">First Name</Header>
                      <TextField name='fName' required/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Last Name</Header>
                      <TextField name='lName' required/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Profile Photo</Header>
                      <TextField name='image' required/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">About Me</Header>
                      <LongTextField name='aboutMe' required/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Demographic</Header>
                      <MultiSelectField name='demographicLevel' placeholder={'demographicLevel'}
                                       // allowedValues={demographicLevelP}
                                        required/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Tools</Header>
                      <MultiSelectField name='tools' placeholder={'Toolsets'}
                                        allowedValues={toolsP} required/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Skills</Header>
                      <MultiSelectField name='skills' placeholder={'Skills'}
                                        allowedValues={skillsP} required/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Challenges</Header>
                      <MultiSelectField name='challenges' placeholder={'Challenges'}
                                        allowedValues={ChallengesP} required/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">GitHub</Header>
                      <TextField name='gitHub'/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">LinkedIn</Header>
                      <TextField name='linkedIn'/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <Header inverted as="h3" textAlign="center">Personal Website</Header>
                      <TextField name='website'/>
                    </Grid.Row>
                    <br/>
                    <SubmitField value='Submit'
                                 style={{
                                   color: 'white', backgroundColor: '#24252B',
                                   margin: '2rem 0rem',
                                 }}/>
                  </Grid.Column>
                </Grid>
                  <ErrorsField/>
              </Segment>
              </div>
              </AutoForm>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

editProfile.propTypes = {
 // demographicLevel: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  developer: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
 // const demographicLevel = demographicLevel.subscribe();
  const subscription1 = Tools.subscribe();
  const subscription = Skills.subscribe();
  const subscription2 = Challenges.subscribe();
  const subscription3 = Developers.subscribe();
  return {
  //  demographicLevel: demographicLevel.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    developer: Developers.find({}).fetch(),
    ready: subscription.ready() && subscription1.ready() && subscription2.ready() && subscription3.ready(),
  };
})(editProfile);
