import React from 'react';
import _ from 'lodash';
import { Grid, Segment, Loader } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, SelectField, SubmitField,
  TextField, LongTextField, BoolField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { demographicLevels } from '../../../api/level/Levels';
import MultiSelectField from '../../components/form-fields/MultiSelectField';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

// added challenges, skills, tools fields to the Participants schema
const schema = new SimpleSchema({
  username: { type: String },
  slugID: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  demographicLevel: { type: String, allowedValues: demographicLevels, optional: true },
  linkedIn: { type: String, optional: true },
  gitHub: { type: String, optional: true },
  website: { type: String, optional: true },
  aboutMe: { type: String, optional: true },
  userID: { type: SimpleSchema.RegEx.Id, optional: true },
  lookingForTeam: { type: Boolean, optional: true },
  isCompliant: { type: Boolean, optional: true },
  challenges: { type: Array, optional: true },
  'challenges.$': { type: String },
  skills: { type: Array, optional: true },
  'skills.$': { type: String },
  tools: { type: Array, optional: true },
  'tools.$': { type: String },
});

/**
 * A simple edit page thats prefilled with any info about the participant.
 * @memberOf ui/pages
 */
class EditProfile extends React.Component {

  /**
   * On successful submit, insert the data.
   * @param data {Object} the result from the form.
   */
  submit(data) {
    const { firstName, lastName, demographicLevel, lookingForTeam, challenges,
      skills, tools, linkedIn, gitHub, website, aboutMe, isCompliant, _id } = data;

    const challengesList = this.props.challenges;
    const challengeIds = [];
    const skillsList = this.props.skills;
    const skillIds = [];
    const toolsList = this.props.tools;
    const toolIds = [];

    if (challenges) {
      for (let i = 0; i < challengesList.length; i++) {
        for (let j = 0; j < challenges.length; j++) {
          if (challengesList[i].title === challenges[j]) {
            challengeIds.push(challengesList[i].slugID);
          }
        }
      }
    }

    if (skills) {
      for (let i = 0; i < skillsList.length; i++) {
        for (let j = 0; j < skills.length; j++) {
          if (skillsList[i].name === skills[j]) {
            skillIds.push(skillsList[i].slugID);
          }
        }
      }
    }

    if (tools) {
      for (let i = 0; i < toolsList.length; i++) {
        for (let j = 0; j < tools.length; j++) {
          if (toolsList[i].name === tools[j]) {
            toolIds.push(toolsList[i].slugID);
          }
        }
      }
    }

    const updateData = {
      id: _id,
      firstName,
      lastName,
      demographicLevel,
      lookingForTeam,
      challenges: challengeIds,
      isCompliant,
      skills: skillIds,
      tools: toolIds,
      linkedIn,
      gitHub,
      website,
      aboutMe,
    };
    updateMethod.call({ collectionName: Participants.getCollectionName(), updateData: updateData }, (error) => (error ?
        swal('Error', error.message, 'error') :
        swal('Success', 'Item updated successfully', 'success')));
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const formSchema = new SimpleSchema2Bridge(schema);
    const challengeList = _.map(this.props.challenges, 'title');
    const skillList = _.map(this.props.skills, 'name');
    const toolList = _.map(this.props.tools, 'name');
    const dev = Participants.findOne();
    const devChal = [];
    const devSkill = [];
    const devTool = [];
    // add the participants challenges, skills, tools in the edit form
    _.forEach(this.props.devChallenges, (c) => _.forEach(this.props.challenges, (p) => {
      // eslint-disable-next-line no-unused-expressions
          (c.challengeID === p._id) ? devChal.push(p.title) : '';
        }));

    _.forEach(this.props.devSkills, (c) => _.forEach(this.props.skills, (p) => {
      // eslint-disable-next-line no-unused-expressions
          (c.skillID === p._id) ? devSkill.push(p.name) : '';
        }));

    _.forEach(this.props.devTools, (c) => _.forEach(this.props.tools, (p) => {
      // eslint-disable-next-line no-unused-expressions
          (c.toolID === p._id) ? devTool.push(p.name) : '';
        }));

    dev.tools = devTool;
    dev.skills = devSkill;
    dev.challenges = devChal;

    return (
        <Grid stackable={true} textAlign='center' container>

          <Grid.Row columns={1}>
            <Grid.Column>
              <h1>Edit Your Profile</h1>
            </Grid.Column>
            <Grid.Column floated='right'>
              <Link to='/profile'>Cancel</Link>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <AutoForm schema={formSchema} onSubmit={data => this.submit(data)} model={dev}>
                <Segment>
                  <SelectField name='demographicLevel'/>
                  <BoolField name='lookingForTeam'/>
                  <TextField name='linkedIn' placeholder='linkedin url...' label='LinkedIn'/>
                  <TextField name='gitHub' placeholder='github url...' label='Github'/>
                  <TextField name='website' placeholder='website url...'/>
                  <MultiSelectField name='challenges' allowedValues={challengeList} placeholder='Challenges'/>
                  <MultiSelectField name='skills' allowedValues={skillList} placeholder='Skills'/>
                  <MultiSelectField name='tools' allowedValues={toolList} placeholder='Tools'/>
                  <LongTextField name='aboutMe' placeholder='a short bio about yourself...'/>
                  <SubmitField value='Submit'/>
                  <ErrorsField/>
                </Segment>
              </AutoForm>
            </Grid.Column>
          </Grid.Row>

        </Grid>
    );
  }
}

EditProfile.propTypes = {
  tools: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  devTools: PropTypes.array.isRequired,
  devSkills: PropTypes.array.isRequired,
  devChallenges: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to documents.
  const toolsSubscription = Tools.subscribe();
  const skillsSubscription = Skills.subscribe();
  const participantsSubscription = Participants.subscribe();
  const challengesSubscription = Challenges.subscribe();
  const devToolsSubscription = ParticipantTools.subscribe();
  const devSkillsSubscription = ParticipantSkills.subscribe();
  const devChallengesSubscription = ParticipantChallenges.subscribe();
  return {
    tools: Tools.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    participants: Participants.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    devTools: ParticipantTools.find({}).fetch(),
    devSkills: ParticipantSkills.find({}).fetch(),
    devChallenges: ParticipantChallenges.find({}).fetch(),
    ready: toolsSubscription.ready() && skillsSubscription.ready() &&
        participantsSubscription.ready() && challengesSubscription.ready() &&
        devToolsSubscription.ready() && devSkillsSubscription.ready() &&
        devChallengesSubscription.ready(),
  };
})(EditProfile);
