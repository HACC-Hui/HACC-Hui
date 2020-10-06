import React from 'react';
import { Grid, Segment, Header, Divider, Loader, Form, Dropdown, Button } from 'semantic-ui-react';
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
import { Participants } from '../../../api/user/ParticipantCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { skillAndToolLevels } from '../../../api/level/Levels';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class CreateTeamWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { model: this.buildTheModel() };
    this.newSkillRef = React.createRef();
    this.newSkillLevelRef = React.createRef();
    this.newToolRef = React.createRef();
    this.newToolLevelRef = React.createRef();
  }

  buildTheModel() {
    return {
      skills: [],
      tools: [],
    };
  }

  buildTheFormSchema() {
    const challengeNames = _.map(this.props.challenges, (c) => c.title);
    const skillNames = _.map(this.props.skills, (s) => s.name);
    const toolNames = _.map(this.props.tools, (t) => t.name);
    const schema = new SimpleSchema({
      open: {
        type: String,
        allowedValues: ['Open', 'Close'],
        label: 'Availability',
      },
      name: String,
      image: { type: String, optional: true },
      challenges: { type: Array, label: 'Challenges' },
      'challenges.$': { type: String, allowedValues: challengeNames },
      skills: { type: Array, label: 'Skills', optional: true },
      'skills.$': { type: String, allowedValues: skillNames },
      tools: { type: Array, label: 'Toolsets', optional: true },
      'tools.$': { type: String, allowedValues: toolNames },
      description: String,
      github: { type: String, optional: true },
      devpostPage: { type: String, optional: true },
      affiliation: { type: String, optional: true },
    });
    return schema;
  }

  /** On submit, insert the data.
   * @param formData {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  // eslint-disable-next-line no-unused-vars
  submit(formData, formRef) {

    console.log('CreateTeam.submit', formData, this.props);
    const skillsArr = this.props.skills;
    const skillsObj = [];

    const toolsArr = this.props.tools;
    const toolsObj = [];

    const challengesArr = this.props.challenges;
    const challengesObj = [];

    const owner = Participants.findDoc({ userID: Meteor.userId() }).username;

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

    _.forEach(formData.skills, (s) => skillsObj.push(s.slug));
    _.forEach(formData.tools, (t) => toolsObj.push(t.slug));
    _.forEach((formData.challenges, (c) => {
      const challengeDoc = Challenges.findDoc({ title: c });
      challengesObj.push(Slugs.getNameFromID(challengeDoc.slugID));
    }));

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
        (error, result) => {
          if (error) {
            swal('Error', error.message, 'error');
            // console.error(error.message);
          } else {
            swal('Success', 'Team created successfully', 'success');
            formRef.reset();
            console.log(result);
            if (formData.skills) {
              formData.skills.forEach((s) => {
                const skillID = Slugs.getEntityID(s.slug);
                // const doc = TeamSkills.findDoc()
              });
            }

          }
        });
    if (formData.tools) {

    }
    // console.log(docID);
  }

  renderSkills() {
    const { model } = this.state;
    // console.log(model);
    const { skills } = this.props;
    const chosenSkills = model.skills;
    // console.log(skills, chosenSkills);
    const chosen = _.map(chosenSkills, (cs) => {
      const instanceID = Slugs.getEntityID(cs.slug);
      return Skills.findDoc(instanceID);
    });
    const rest = _.differenceBy(skills, chosen, '_id');
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
    const handleSkillChange = (e, data) => {
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
    const handleSkillAdd = () => {
      // console.log(this.newSkillRef.current.state.value, this.newSkillLevelRef.current.state.value);
      const newSkill = this.newSkillRef.current.state.value;
      const newLevel = this.newSkillLevelRef.current.state.value;
      // console.log('handleSkillAdd', newSkill, newLevel);
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
    const handleSkillDelete = (slug) => () => {
      model.skills = _.filter(model.skills, (skill) => skill.slug !== slug);
      this.setState({ model });
    };
    const style = { marginLeft: 5 };
    return (
        <React.Fragment>
          <Header dividing size="small">Desired skills</Header>
          {model.skills.map((skill) => (
              <Form.Group key={skill.slug}>
                <Form.Field label={getSkillName(skill.slug)} />
                <Dropdown id={skill.slug} options={levelChoices} value={skill.level} onChange={handleSkillChange} />
                <Button style={style} size="mini" color="red"
                        onClick={handleSkillDelete(skill.slug)}>Delete Skill</Button>
              </Form.Group>
          ))}
          {restChoices.length > 0 ? (
              <React.Fragment>
                <Header size="small">Add a skill</Header>
                <Form.Group widths="equal">
                  <Dropdown ref={this.newSkillRef} options={restChoices} placeholder="Choose a skill" />
                  <Dropdown ref={this.newSkillLevelRef} options={levelChoices} placeholder="Choose a skill level" />
                  <Button style={style} size="mini" color="teal" onClick={handleSkillAdd}>Add skill</Button>
                </Form.Group>
              </React.Fragment>
          ) : ''}

        </React.Fragment>
    );
  }

  renderTools() {
    const { model } = this.state;
    const { tools } = this.props;
    const chosenTools = model.tools;
    const chosen = _.map(chosenTools, (ct) => {
      const instanceID = Slugs.getEntityID(ct.slug);
      return Tools.findDoc(instanceID);
    });
    const rest = _.differenceBy(tools, chosen, '_id');
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
    const handleToolChange = (e, data) => {
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
    const handleToolDelete = (slug) => () => {
      model.tools = _.filter(model.tools, (skill) => skill.slug !== slug);
      // console.log(model.tools);
      this.setState({ model });
    };
    const handleToolAdd = () => {
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
          <Header dividing size="small">Desired tools</Header>
          {model.tools.map((tool) => (
              <Form.Group key={tool.slug}>
                <Form.Field label={getToolName(tool.slug)} />
                <Dropdown id={tool.slug} options={levelChoices} value={tool.level} onChange={handleToolChange} />
                <Button style={style} size="mini" color="red"
                        onClick={handleToolDelete(tool.slug)}>Delete Tool</Button>
              </Form.Group>
          ))}
          {restChoices.length > 0 ? (
              <React.Fragment>
                <Header size="small">Add a tool</Header>
                <Form.Group widths="equal">
                  <Dropdown ref={this.newToolRef} options={restChoices} placeholder="Choose a tool" />
                  <Dropdown ref={this.newToolLevelRef} options={levelChoices} placeholder="Choose a tool level" />
                  <Button style={style} size="mini" color="teal" onClick={handleToolAdd}>Add tool</Button>
                </Form.Group>
              </React.Fragment>
          ) : ''}
          <Form.Group widths="equal">
          </Form.Group>
        </React.Fragment>
    );
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(this.buildTheFormSchema());
    const challengeArr = _.map(this.props.challenges, 'title');
    const { model } = this.state;
    return (
        <Grid container centered>
          <Grid.Column>
            <Divider hidden />
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} model={model} onSubmit={data => this.submit(data, fRef)}
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
                    <Grid columns={2}>
                      <Grid.Column>{this.renderSkills(model)}</Grid.Column>
                      <Grid.Column>{this.renderTools(model)}</Grid.Column>
                    </Grid>
                    <TextField name="github" />
                    <TextField name="devpostPage" />
                    <TextField name="affiliation" />
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

CreateTeamWidget.propTypes = {
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
};

export default withTracker(() => ({
  challenges: Challenges.find({}).fetch(),
  skills: Skills.find({}).fetch(),
  tools: Tools.find({}).fetch(),
  participants: Participants.find({}).fetch(),
}))(CreateTeamWidget);
