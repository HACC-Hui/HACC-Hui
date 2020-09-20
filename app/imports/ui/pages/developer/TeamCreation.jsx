import React from 'react';
import { Grid, Segment, Header, Divider, Loader } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
} from 'uniforms-semantic';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../../components/form-fields/MultiSelectField';
import RadioField from '../../components/form-fields/RadioField';
import { Teams } from '../../../api/team/TeamCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Developers } from '../../../api/user/DeveloperCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  open: {
    type: String,
    allowedValues: ['Open', 'Close'],
    label: 'Availability',
  },
  name: String,
  image: { type: String, optional: true },
  challenges: { type: Array, label: 'Challenges' },
  'challenges.$': { type: String },
  skills: { type: Array, label: 'Skills' },
  'skills.$': { type: String },
  tools: { type: Array, label: 'Toolsets' },
  'tools.$': { type: String },
  description: String,
  github: { type: String, optional: true },
  devpostPage: { type: String, optional: true },
});

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class TeamCreation extends React.Component {

  /** On submit, insert the data.
   * @param formData {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  // eslint-disable-next-line no-unused-vars
  submit(formData, formRef) {

    // console.log('CreateTeam.submit', formData, this.props);
    const skillsArr = this.props.skills;
    const skillsObj = [];

    const toolsArr = this.props.tools;
    const toolsObj = [];

    const challengesArr = this.props.challenges;
    const challengesObj = [];

    const owner = Developers.findDoc({ userID: Meteor.userId() }).username;

    const {
      name, description, challenges, skills, tools, image,
    } = formData;
    let { open } = formData;
    // console.log(challenges, skills, tools, open);
    if (open === 'Open') {
      open = true;
    } else {
      open = false;
      // console.log('FALSE');
    }

    for (let i = 0; i < skillsArr.length; i++) {
      for (let j = 0; j < skills.length; j++) {
        if (skillsArr[i].name === skills[j]) {
          skillsObj.push(Slugs.getNameFromID(skillsArr[i].slugID));
        }
      }
    }

    for (let i = 0; i < toolsArr.length; i++) {
      for (let j = 0; j < tools.length; j++) {
        if (toolsArr[i].name === tools[j]) {
          toolsObj.push(Slugs.getNameFromID(toolsArr[i].slugID));
        }
      }
    }

    for (let i = 0; i < challengesArr.length; i++) {
      for (let j = 0; j < challenges.length; j++) {
        if (challengesArr[i].title === challenges[j]) {
          challengesObj.push(Slugs.getNameFromID(challengesArr[i].slugID));
        }
      }
    }

    // If the name has special character or space, throw a swal error and return early.
    if (/^[a-zA-Z0-9-]*$/.test(name) === false) {
      swal('Error', 'Sorry, no special characters or space allowed.', 'error');
      return;
    }
    const collectionName = Teams.getCollectionName();
    const definitionData = {
      name,
      description,
      owner,
      open,
      image,
      challenges: challengesObj,
      skills: skillsObj,
      tools: toolsObj,
    };
    // console.log(collectionName, definitionData);
    defineMethod.call({
          collectionName,
          definitionData,
        },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
            // console.error(error.message);
          } else {
            swal('Success', 'Team created successfully', 'success');
            formRef.reset();
            //   console.log('Success');
          }
        });
    // console.log(docID);
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    // console.log(Teams.dumpAll());
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(schema);
    const challengeArr = _.map(this.props.challenges, 'title');
    const skillArr = _.map(this.props.skills, 'name');
    const toolArr = _.map(this.props.tools, 'name');

    return (
        <Grid container centered>
          <Grid.Column>
            <Divider hidden />
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}
                      style={{
                        paddingBottom: '40px',
                      }}>
              <Segment style={{
                borderRadius: '10px',
                backgroundColor: '#5C93D1',
              }} className={'createTeam'}>
                <Grid columns={1} style={{ paddingTop: '20px' }}>
                  <Grid.Column style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                    <Header as="h2" textAlign="center" inverted>Team Information</Header>
                    <Grid className='doubleLine'>
                      <TextField name='name' />
                      <RadioField
                          name='open'
                          inline
                      />
                    </Grid>
                    <TextField name='image' placeholder={'Team Image URL'} />
                    <LongTextField name='description' />
                    <MultiSelectField name='challenges' placeholder={'Challenges'}
                                      allowedValues={challengeArr} required />
                    <MultiSelectField name='skills' placeholder={'Skills'}
                                      allowedValues={skillArr} required />
                    <MultiSelectField name='tools' placeholder={'Toolsets'}
                                      allowedValues={toolArr} required />
                    <TextField name="github" />
                    <TextField name="devpostPage" />
                  </Grid.Column>
                </Grid>
                <div align='center'>
                  <SubmitField value='Submit'
                               style={{
                                 color: 'white', backgroundColor: '#dd000a',
                                 margin: '20px 0px',
                               }} />
                </div>
                <ErrorsField />
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

TeamCreation.propTypes = {
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  developers: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,

};

export default withTracker(() => {
  const subscriptionChallenges = Challenges.subscribe();
  const subscriptionSkills = Skills.subscribe();
  const subscriptionTools = Tools.subscribe();
  const subscriptionDevelopers = Developers.subscribe();

  return {
    challenges: Challenges.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    developers: Developers.find({}).fetch(),
    // eslint-disable-next-line max-len
    ready: subscriptionChallenges.ready() && subscriptionSkills.ready() && subscriptionTools.ready() && subscriptionDevelopers.ready(),
  };
})(TeamCreation);
