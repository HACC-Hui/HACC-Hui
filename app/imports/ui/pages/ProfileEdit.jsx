import React from 'react';
import { Grid, Segment, Header, Icon } from 'semantic-ui-react';
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
import { demographicLevels } from '../../api/level/Levels';
import { Skills } from '../../api/skill/SkillCollection';
import { Tools } from '../../api/tool/ToolCollection';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { Developers } from '../../api/user/DeveloperCollection';

const editSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  image: String,
  aboutMe: String,
  linkedIn: { type: String, optional: true },
  gitHub: { type: String, optional: true },
  website: { type: String, optional: true },
  tools: {
    type: Array,
  },
  'tools.$': {
    type: String,
  },
  skills: {
    type: Array,
  },
  'skills.$': {
    type: String,
  },
  challenges: {
    type: Array,
  },
  'challenges.$': {
    type: String,
  },
  demographicLevel: {
    type: Array,
  },
  'demographicLevel.$': {
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
    const skillsP = this.props.skills;
    const skillsOb = [];
    const toolsP = this.props.tools;
    const toolsOb = [];
    const ChallengesP = this.props.challenges;
    const ChallengesOb = [];

    let {
      challenges, skills, tools, aboutMe,
      website, gitHub, linkedIn, firstName, lastName, image,
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
            aboutMe,
            owner,
            firstName,
            lastName,
            image,
            website,
            gitHub,
            linkedIn,
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
    let fRef = null;
    return (
        <div style={{ backgroundColor: '#24252B' }}>
          <Grid container centered>
            <Grid.Column >
              <AutoForm ref={ref => { fRef = ref; }} schema={eSchema} onSubmit={data => this.submit(data, fRef)}>
              <div className='profileEditBox' style={{ padding: '10rem 5rem', margin: '2rem 0rem' }}>
                <Segment style={{
                  borderRadius: '1rem',
                  backgroundColor: '#C4C4C4',
                }}>
                  <Grid container centered>
                    <br/>
                  <Header as='h1'><Icon name='settings' size={'large'}/>EDIT YOUR PROFILE</Header>
                    <br/>
                  </Grid>
                <Grid columns={'2'} stackable>
                  <Grid.Column>
                    <br/>
                    <Grid.Row>
                      <TextField name='firstName' required/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <TextField name='lastName' required/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <TextField name='image' required/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <TextField name='gitHub'/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <TextField name='linkedIn'/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <TextField name='website'/>
                    </Grid.Row>
                    <br/>
                  </Grid.Column>
                  <Grid.Column>
                    <Grid.Row>
                      <LongTextField name='aboutMe'/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <MultiSelectField name='demographicLevel'
                                        allowedValues={demographicLevels}
                                        required/>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <MultiSelectField name='tools' placeholder={'Toolsets'}
                                        allowedValues={toolsP} />
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <MultiSelectField name='skills' placeholder={'Skills'}
                                        allowedValues={skillsP} />
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                      <MultiSelectField name='challenges'
                                        allowedValues={ChallengesP} required/>
                    </Grid.Row>
                    <br/>
                  </Grid.Column>
                    <Grid container centered>
                      <br/>
                    <SubmitField value='Submit' style={{ color: 'white', backgroundColor: '#24252B' }}/>
                      <br/>
                    </Grid>
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
  tools: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  developer: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const subscription1 = Tools.subscribe();
  const subscription = Skills.subscribe();
  const subscription2 = Challenges.subscribe();
  const subscription3 = Developers.subscribe();
  return {
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    developer: Developers.find({}).fetch(),
    ready: subscription.ready() && subscription1.ready() && subscription2.ready() && subscription3.ready(),
  };
})(editProfile);
