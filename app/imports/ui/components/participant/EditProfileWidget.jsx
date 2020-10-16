import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Form, Header, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, BoolField, LongTextField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantInterests } from '../../../api/user/ParticipantInterestCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { demographicLevels } from '../../../api/level/Levels';
import MultiSelectField from '../form-fields/MultiSelectField';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROUTES } from '../../../startup/client/route-constants';

class EditProfileWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirectToReferer: false };
    this.newSkillRef = React.createRef();
    this.newSkillLevelRef = React.createRef();
    this.newToolRef = React.createRef();
    this.newToolLevelRef = React.createRef();
  }

  buildTheFormSchema() {
    const challengeNames = _.map(this.props.allChallenges, (c) => c.title);
    const interestNames = _.map(this.props.allInterests, (i) => i.name);
    const skillNames = _.map(this.props.allSkills, (s) => s.name);
    const toolNames = _.map(this.props.allTools, (t) => t.name);
    const schema = new SimpleSchema({
      firstName: String,
      lastName: String,
      username: String,
      demographicLevel: { type: String, allowedValues: demographicLevels, optional: true },
      linkedIn: { type: String, optional: true },
      gitHub: { type: String, optional: true },
      website: { type: String, optional: true },
      aboutMe: { type: String, optional: true },
      userID: { type: SimpleSchema.RegEx.Id, optional: true },
      lookingForTeam: { type: Boolean, optional: true },
      isCompliant: { type: Boolean, optional: true },
      challenges: { type: Array, optional: true },
      'challenges.$': { type: String, allowedValues: challengeNames },
      interests: { type: Array, optional: true },
      'interests.$': { type: String, allowedValues: interestNames },
      skills: { type: Array, optional: true },
      'skills.$': { type: String, allowedValues: skillNames },
      tools: { type: Array, optional: true },
      'tools.$': { type: String, allowedValues: toolNames },
    });
    return schema;
  }

  buildTheModel() {
    const model = this.props.participant;
    model.challenges = _.map(this.props.devChallenges, (challenge) => {
      const c = Challenges.findDoc(challenge.challengeID);
      return c.title;
    });
    model.interests = _.map(this.props.devInterests, (interest) => {
      const i = Interests.findDoc(interest.interestID);
      return i.name;
    });
    model.skills = _.map(this.props.devSkills, (skill) => {
      // console.log(skill);
      const s = Skills.findDoc(skill.skillID);
      return s.name;
    });
    model.tools = _.map(this.props.devTools, (tool) => {
      const t = Tools.findDoc(tool.toolID);
      return t.name;
    });
    return model;
  }

  submitData(data) {
    console.log('submit', data);
    const collectionName = Participants.getCollectionName();
    const updateData = {};
    // firstName, lastName, demographicLevel, lookingForTeam, challenges, interests,
    //     skills, tools, linkedIn, gitHub, website, aboutMe,
    updateData.id = data._id;
    updateData.firstName = data.firstName;
    updateData.lastName = data.lastName;
    if (data.demographicLevel) {
      updateData.demographicLevel = data.demographicLevel;
    }
    if (data.challenges) {
      // build an array of challenge slugs
      updateData.challenges = data.challenges.map((title) => {
        const doc = Challenges.findDoc({ title });
        return Slugs.getNameFromID(doc.slugID);
      });
    }
    if (data.interests) {
      // build an array of interest slugs
      updateData.interests = data.interests.map((name) => {
        const doc = Interests.findDoc({ name });
        return Slugs.getNameFromID(doc.slugID);
      });
    }
    if (data.skills) {
      updateData.skills = data.skills.map((name) => {
        const doc = Skills.findDoc({ name });
        return Slugs.getNameFromID(doc.slugID);
      });
    }
    if (data.tools) {
      updateData.tools = data.tools.map((name) => {
        const doc = Tools.findDoc({ name });
        return Slugs.getNameFromID(doc.slugID);
      });
    }
    if (data.linkedIn) {
      updateData.linkedIn = data.linkedIn;
    }
    if (data.gitHub) {
      updateData.gitHub = data.gitHub;
    }
    if (data.website) {
      updateData.website = data.website;
    }
    if (data.aboutMe) {
      updateData.aboutMe = data.aboutMe;
    }
    console.log(collectionName, updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href>Why do I have this issue?</a>',
        });
      } else {
        Swal.fire({
          icon: 'success',
          text: 'Your profile is updated.',
        });
      }
    });
    this.setState({ redirectToReferer: true });
  }

  render() {
    // console.log(this.props);
    if (this.state.redirectToReferer) {
      const from = { pathname: ROUTES.YOUR_PROFILE };
      return <Redirect to={from}/>;
    }
    const model = this.buildTheModel();
    const schema = this.buildTheFormSchema();
    const formSchema = new SimpleSchema2Bridge(schema);
    // console.log('render', model, schema);
    return (
        <Segment>
          <Header dividing>Edit Profile</Header>
          <AutoForm schema={formSchema} model={model} onSubmit={data => {
            console.log(data);
            this.submitData(data);
          }}>
            <Form.Group widths="equal">
              <TextField name="username" disabled />
              <BoolField name="isCompliant" disabled />
            </Form.Group>
            <Form.Group widths="equal">
              <TextField name="firstName" />
              <TextField name="lastName" />
              <SelectField name="demographicLevel" />
            </Form.Group>
            <Form.Group widths="equal">
              <TextField name="linkedIn" />
              <TextField name="gitHub" />
            </Form.Group>
            <Form.Group widths="equal">
              <TextField name="website" />
              <LongTextField name="aboutMe" />
            </Form.Group>
            <Form.Group widths="equal">
              <MultiSelectField name="challenges" />
              <MultiSelectField name="interests" />
            </Form.Group>
            <Form.Group widths="equal">
              <MultiSelectField name="skills" />
              <MultiSelectField name="tools" />
            </Form.Group>
            <SubmitField />
          </AutoForm>
        </Segment>
    );
  }
}

EditProfileWidget.propTypes = {
  allChallenges: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  allInterests: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  allSkills: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  allTools: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  participant: PropTypes.object.isRequired,
  devChallenges: PropTypes.arrayOf(
      PropTypes.object,
  ),
  devInterests: PropTypes.arrayOf(
      PropTypes.object,
  ),
  devSkills: PropTypes.arrayOf(
      PropTypes.object,
  ),
  devTools: PropTypes.arrayOf(
      PropTypes.object,
  ),
};

export default withTracker(() => {
  const allChallenges = Challenges.find({}).fetch();
  const allInterests = Interests.find({}).fetch();
  const allSkills = Skills.find({}).fetch();
  const allTools = Tools.find({}).fetch();
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  const participantID = participant._id;
  const devChallenges = ParticipantChallenges.find({ participantID }).fetch();
  const devInterests = ParticipantInterests.find({ participantID }).fetch();
  const devSkills = ParticipantSkills.find({ participantID }).fetch();
  const devTools = ParticipantTools.find({ participantID }).fetch();
  return {
    allChallenges,
    allInterests,
    allSkills,
    allTools,
    participant,
    devChallenges,
    devInterests,
    devSkills,
    devTools,
  };
})(EditProfileWidget);
