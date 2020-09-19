import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Button, Dropdown, Form, Grid, Header, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, BoolField, LongTextField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import Swal from 'sweetalert2';
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
import { demographicLevels, skillAndToolLevels } from '../../../api/level/Levels';
import MultiSelectField from '../form-fields/MultiSelectField';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

class EditProfileWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { model: this.buildTheModel() };
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
    // console.log('submit', data);
    let collectionName = Developers.getCollectionName();
    let updateData = {};
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
      updateData.skills = data.skills.map((s) => s.slug);
    }
    if (data.tools) {
      updateData.tools = data.tools.map((t) => t.slug);
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
    // console.log(collectionName, updateData);
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
    const developerID = data._id;
    if (data.skills) {
      // update the level of the tools
      data.skills.forEach((s) => {
        const skillID = Slugs.getEntityID(s.slug);
        const doc = DeveloperSkills.findDoc({ developerID, skillID });
        collectionName = DeveloperSkills.getCollectionName();
        updateData = {};
        updateData.id = doc._id;
        updateData.skillLevel = s.level;
        updateMethod.call({ collectionName, updateData }, (error) => {
          if (error) {
            console.error(error);
          }
        });
      });
    }
    if (data.tools) {
      // update the level of the tools
      data.tools.forEach((t) => {
        const toolID = Slugs.getEntityID(t.slug);
        const doc = DeveloperTools.findDoc({ developerID, toolID });
        collectionName = DeveloperTools.getCollectionName();
        updateData = {};
        updateData.id = doc._id;
        updateData.toolLevel = t.level;
        updateMethod.call({ collectionName, updateData }, (error) => {
          if (error) {
            console.error(error);
          }
        });
      });
    }
  }

  renderTools() {
    const { model } = this.state;
    const { allTools } = this.props;
    const chosenTools = model.tools;
    const chosen = _.map(chosenTools, (ct) => {
      const instanceID = Slugs.getEntityID(ct.slug);
      return Tools.findDoc(instanceID);
    });
    const rest = _.differenceBy(allTools, chosen, '_id');
    const restChoices = rest.map((r, index) => (
        {
          key: index,
          text: r.name,
          value: r.name,
        }
    ));
    const levelChoices = skillAndToolLevels.map((level, index) => (
        {
          key: index,
          text: level,
          value: level,
        }
    ));
    const handleChange = (e, data) => {
      // console.log(e, data);
      const { id, value } = data;
      // change the model.skills with slug = id to value.
      // eslint-disable-next-line no-param-reassign
      model.tools = _.filter(model.tools, (skill) => skill.slug !== id);
      // console.log(model.skills);
      model.tools.push({
        slug: id,
        level: value,
      });
      // console.log(model.skills);
      this.setState({ model });
    };
    const handleDelete = (slug) => () => {
      model.tools = _.filter(model.tools, (skill) => skill.slug !== slug);
      // console.log(model.tools);
      this.setState({ model });
    };
    const handleAdd = () => {
      // console.log('handleAdd');
      // console.log(this.newSkillRef.current.state.value, this.newSkillLevelRef.current.state.value);
      const newTool = this.newToolRef.current.state.value;
      const newLevel = this.newToolLevelRef.current.state.value;
      if (newTool && newLevel) {
        const toolDoc = Tools.findDoc({ name: newTool });
        const toolSlug = Slugs.getNameFromID(toolDoc.slugID);
        model.tools.push({
          slug: toolSlug,
          level: newLevel,
        });
        this.setState({ model });
      }
    };
    const getToolName = (slug) => {
      const instanceID = Slugs.getEntityID(slug);
      return Tools.findDoc(instanceID).name;
    };
    const style = { marginLeft: 5 };
    return (
        <React.Fragment>
          <Header dividing size="small">Your tools</Header>
          {model.tools.map((skill) => (
              <Form.Group key={skill.slug}>
                <Form.Field label={getToolName(skill.slug)} />
                <Dropdown id={skill.slug} options={levelChoices} value={skill.level} onChange={handleChange} />
                <Button style={style} size="mini" color="red" onClick={handleDelete(skill.slug)}>Delete Tool</Button>
              </Form.Group>
          ))}
          {restChoices.length > 0 ? (
              <React.Fragment>
                <Header size="small">Add a tool</Header>
                <Form.Group widths="equal">
                  <Dropdown ref={this.newToolRef} options={restChoices} placeholder="Choose a tool" />
                  <Dropdown ref={this.newToolLevelRef} options={levelChoices} placeholder="Choose a tool level" />
                  <Button style={style} size="mini" color="teal" onClick={handleAdd}>Add tool</Button>
                </Form.Group>
              </React.Fragment>
          ) : ''}
          <Form.Group widths="equal">
          </Form.Group>
        </React.Fragment>
    );
  }

  renderSkills() {
    const { model } = this.state;
    // console.log(this.props.allSkills, model);
    const { allSkills } = this.props;
    const chosenSkills = model.skills;
    // console.log(allSkills, chosenSkills);
    const chosen = _.map(chosenSkills, (cs) => {
      const instanceID = Slugs.getEntityID(cs.slug);
      return Skills.findDoc(instanceID);
    });
    const rest = _.differenceBy(allSkills, chosen, '_id');
    const restChoices = rest.map((r, index) => (
        {
          key: index,
          text: r.name,
          value: r.name,
        }
    ));
    const levelChoices = skillAndToolLevels.map((level, index) => (
        {
          key: index,
          text: level,
          value: level,
        }
    ));
    // console.log(chosen, rest, levelChoices);
    const handleChange = (e, data) => {
      // console.log(e, data);
      const { id, value } = data;
      // change the model.skills with slug = id to value.
      // eslint-disable-next-line no-param-reassign
      model.skills = _.filter(model.skills, (skill) => skill.slug !== id);
      // console.log(model.skills);
      model.skills.push({
        slug: id,
        level: value,
      });
      // console.log(model.skills);
      this.setState({ model });
    };
    const getSkillName = (slug) => {
      const instanceID = Slugs.getEntityID(slug);
      return Skills.findDoc(instanceID).name;
    };
    const handleAdd = () => {
      // console.log(this.newSkillRef.current.state.value, this.newSkillLevelRef.current.state.value);
      const newSkill = this.newSkillRef.current.state.value;
      const newLevel = this.newSkillLevelRef.current.state.value;
      if (newSkill && newLevel) {
        const skillDoc = Skills.findDoc({ name: newSkill });
        const skillSlug = Slugs.getNameFromID(skillDoc.slugID);
        model.skills.push({
          slug: skillSlug,
          level: newLevel,
        });
        this.setState({ model });
      }
    };
    const handleDelete = (slug) => () => {
      model.skills = _.filter(model.skills, (skill) => skill.slug !== slug);
      this.setState({ model });
    };
    const style = { marginLeft: 5 };
    return (
        <React.Fragment>
          <Header dividing size="small">Your skills</Header>
          {model.skills.map((skill) => (
              <Form.Group key={skill.slug}>
                <Form.Field label={getSkillName(skill.slug)} />
                <Dropdown id={skill.slug} options={levelChoices} value={skill.level} onChange={handleChange} />
                <Button style={style} size="mini" color="red" onClick={handleDelete(skill.slug)}>Delete Skill</Button>
              </Form.Group>
          ))}
          {restChoices.length > 0 ? (
              <React.Fragment>
                <Header size="small">Add a skill</Header>
                <Form.Group widths="equal">
                  <Dropdown ref={this.newSkillRef} options={restChoices} placeholder="Choose a skill" />
                  <Dropdown ref={this.newSkillLevelRef} options={levelChoices} placeholder="Choose a skill level" />
                  <Button style={style} size="mini" color="teal" onClick={handleAdd}>Add skill</Button>
                </Form.Group>
              </React.Fragment>
          ) : ''}

        </React.Fragment>
    );
  }

  render() {
    // console.log(this.props);
    const model = this.buildTheModel();
    const schema = this.buildTheFormSchema();
    const formSchema = new SimpleSchema2Bridge(schema);
    // console.log(model, schema);
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

            <Grid columns={2}>
              <Grid.Column>{this.renderSkills(model)}</Grid.Column>
              <Grid.Column>{this.renderTools(model)}</Grid.Column>
            </Grid>
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
