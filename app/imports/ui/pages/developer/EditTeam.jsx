import React from 'react';
import _ from 'lodash';
import { Grid, Segment, Header, Divider, Loader } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, SelectField, SubmitField,
  TextField, LongTextField, BoolField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import MultiSelectField from '../../components/form-fields/MultiSelectField';
import RadioField from '../../components/form-fields/RadioField';
import { Developers } from '../../../api/user/DeveloperCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';

// added challenges, skills, tools fields to the Developers schema
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
  devPostPage: { type: String, optional: true },
});;

/**
 * A simple edit page thats prefilled with any info about the developer.
 * @memberOf ui/pages
 */
class EditTeam extends React.Component {

  /**
   * On successful submit, insert the data.
   * @param data {Object} the result from the form.
   */
  submit(formData, formRef) {
    const { name, image, challenges,
      skills, tools, description, gitHub, devPostPage, _id } = formData;

    const skillsArr = this.props.skills;
    const skillsObj = [];

    const toolsArr = this.props.tools;
    const toolsObj = [];

    const challengesArr = this.props.challenges;
    const challengesObj = [];

    const owner = this.props.developers[0].slugID;;

    let { open } = formData;
      if (open === 'Open') {
           open = true;
         } else {
           open = false;
         }


      for (let i = 0; i < challengesArr.length; i++) {
            for (let j = 0; j < challenges.length; j++) {
              if (challengesArr[i].title === challenges[j]) {
                challengesObj.push(Slugs.getNameFromID(challengesArr[i].slugID));
              }
            }
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

    if (/^[a-zA-Z0-9-]*$/.test(name) === false) {
          swal('Error', 'Sorry, no special characters or space allowed.', 'error');
          return;
        }

    const updateData = {
      id: _id,
      name,
      description,
      gitHub,
      devPostPage,
      owner,
      open,
      image,
      challenges: challengesObj,
      skills: skillsObj,
      tools: toolsObj,
    };
    updateMethod.call({ collectionName:Teams.getCollectionName(), updateData }, (error) => (error ?
        swal('Error', error.message, 'error') :
        swal('Success', 'Team edited successfully', 'success')));
        formRef.reset();
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
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
            }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} model={this.props.doc }
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
                  <MultiSelectField name='challenges' placeholder={'challenges'}
                    allowedValues={challengeArr} required />
                  <MultiSelectField name='skills' placeholder={'skills'}
                    allowedValues={skillArr} required />
                  <MultiSelectField name='tools' placeholder={'tools'}
                    allowedValues={toolArr} required />
                  <TextField name="github" />
                  <TextField name="devPostPage" />
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

EditTeam.propTypes = {
  tools: PropTypes.array.isRequired,
  teamTools: PropTypes.object,
  skills: PropTypes.array.isRequired,
  teamSkills: PropTypes.object,
  developers: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  teamChallenges: PropTypes.object,
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker((team) => {
  // Get access to documents.
  const teamID = team._id;
  const toolsSubscription = Tools.subscribe();
  const skillsSubscription = Skills.subscribe();
  const developersSubscription = Developers.subscribe();
  const challengesSubscription = Challenges.subscribe();

  return {
    tools: Tools.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    developers: Developers.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    doc: Teams.findOne(teamID),
    teamChallenge: TeamChallenges.find(teamID),
    teamSkills: TeamSkills.find(teamID),
    teamTools: TeamTools.find(teamID),
    ready: toolsSubscription.ready() && skillsSubscription.ready() &&
        developersSubscription.ready() && challengesSubscription.ready(),
  };
})(EditTeam);
