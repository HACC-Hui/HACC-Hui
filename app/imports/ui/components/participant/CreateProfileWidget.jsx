import React from 'react';
import { Header, Segment, Form } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  AutoForm, BoolField,
  LongTextField, SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom';
import { Skills } from '../../../api/skill/SkillCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { demographicLevels } from '../../../api/level/Levels';
import MultiSelectField from '../form-fields/MultiSelectField';
import { ROUTES } from '../../../startup/client/route-constants';
import { Slugs } from '../../../api/slug/SlugCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

class CreateProfileWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirectToReferer: false };
  }

  buildTheFormSchema() {
    const challengeNames = _.map(this.props.challenges, (c) => c.title);
    const interestNames = _.map(this.props.interests, (i) => i.name);
    const skillNames = _.map(this.props.skills, (s) => s.name);
    const toolNames = _.map(this.props.tools, (t) => t.name);
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

  submit(data) {
    // console.log('CreateProfileWidget.submit', data);
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
    const model = this.props.participant;
    // console.log(model);
    const schema = this.buildTheFormSchema();
    const formSchema = new SimpleSchema2Bridge(schema);
    const firstname = model.firstName;
    if (this.state.redirectToReferer) {
      const from = { pathname: ROUTES.YOUR_PROFILE };
      return <Redirect to={from}/>;
    }
    return (
        <Segment>
          <Header dividing>Hello {firstname}, this is your first time to login, so please fill out your profile</Header>
          <AutoForm schema={formSchema} model={model} onSubmit={data => {
            // console.log(data);
            this.submit(data);
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

CreateProfileWidget.propTypes = {
  participant: PropTypes.object.isRequired,
  interests: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  skills: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  challenges: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  tools: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
};

export default withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  const challenges = Challenges.find({}).fetch();
  const interests = Interests.find({}).fetch();
  const skills = Skills.find({}).fetch();
  const tools = Tools.find({}).fetch();
  return {
    participant,
    challenges,
    interests,
    skills,
    tools,
  };
})(CreateProfileWidget);
