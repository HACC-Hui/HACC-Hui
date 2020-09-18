import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Form, FormField, Header, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, BoolField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import { Developers } from '../../../api/user/DeveloperCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { DeveloperChallenges } from '../../../api/user/DeveloperChallengeCollection';
import { DeveloperInterests } from '../../../api/user/DeveloperInterestCollection';
import { DeveloperSkills } from '../../../api/user/DeveloperSkillCollection';
import { DeveloperTools } from '../../../api/user/DeveloperToolCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { demographicLevels } from '../../../api/level/Levels';
import MultiSelectField from '../form-fields/MultiSelectField';

class EditProfileWidget extends React.Component {
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
    const model = this.props.developer;
    model.challenges = _.map(this.props.devChallenges, (challenge) => {
      const c = Challenges.findDoc(challenge.challengeID);
      return Slugs.getNameFromID(c.slugID);
    });
    model.interests = _.map(this.props.devInterests, (interest) => {
      const i = Interests.findDoc(interest.interestID);
      return Slugs.getNameFromID(i.slugID);
    });
    model.skills = _.map(this.props.devSkills, (skill) => {
      // console.log(skill);
      const s = Skills.findDoc(skill.skillID);
      const ret = {};
      ret.slug = Slugs.getNameFromID(s.slugID);
      ret.level = skill.skillLevel;
      // console.log(ret);
      return ret;
    });
    model.tools = _.map(this.props.devTools, (tool) => {
      const t = Tools.findDoc(tool.toolID);
      const ret = {};
      ret.slug = Slugs.getNameFromID(t.slugID);
      ret.level = tool.toolLevel;
      return ret;
    });
    return model;
  }

  submit(data) {
    console.log(data);
  }

  renderTools(model) {
    return (
        <Form.Group widths="equal">
          <FormField>
            <label>Tools</label>
          </FormField>
        </Form.Group>
    );
  }

  renderSkills(model) {
    console.log(this.props.allSkills, model);
    return (
        <React.Fragment>
          <label>Skills</label>
          <Form.Group widths="equal">
          </Form.Group>
        </React.Fragment>
    );
  }

  render() {
    // console.log(this.props);
    const model = this.buildTheModel();
    const schema = this.buildTheFormSchema();
    const formSchema = new SimpleSchema2Bridge(schema);
    console.log(model, schema);
    return (
        <Segment>
          <Header dividing>Edit Developer Profile</Header>
          <AutoForm schema={formSchema} model={model} onSubmit={this.submit}>
            <Form.Group widths="equal">
              <TextField name="username" disabled />
              <BoolField name="isCompliant" disabled />
            </Form.Group>
            <Form.Group widths="equal">
              <TextField name="firstName" />
              <TextField name="lastName" />
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
              {this.renderSkills(model)}
              {this.renderTools(model)}
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
  ),
  allInterests: PropTypes.arrayOf(
      PropTypes.object,
  ),
  allSkills: PropTypes.arrayOf(
      PropTypes.object,
  ),
  allTools: PropTypes.arrayOf(
      PropTypes.object,
  ),
  developer: PropTypes.object.isRequired,
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
  const developer = Developers.findDoc({ userID: Meteor.userId() });
  const developerID = developer._id;
  const devChallenges = DeveloperChallenges.find({ developerID }).fetch();
  const devInterests = DeveloperInterests.find({ developerID }).fetch();
  const devSkills = DeveloperSkills.find({ developerID }).fetch();
  const devTools = DeveloperTools.find({ developerID }).fetch();
  return {
    allChallenges,
    allInterests,
    allSkills,
    allTools,
    developer,
    devChallenges,
    devInterests,
    devSkills,
    devTools,
  };
})(EditProfileWidget);
