import React from 'react';
import { Grid, Segment, Header, Divider, Icon, Message, Form} from 'semantic-ui-react';
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

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class CreateTeamWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newPerson: '', people:[], redirectToReferer: false };
    console.log(this.state.people);
  }

  handleChange = (e, { value }) => {
    this.setState({ newPerson: value })
    console.log(this.state.newPerson)
  }

  handleClick = () => {
    this.setState({ people: this.state.people.push(this.state.newPerson) })
    this.setState({ newPerson: '' })
  }
  handleSubmitName = () => {
    this.state.people.push(this.state.newPerson);
    this.setState({ newPerson: '' })
    console.log(this.state.people)
  }
  buildTheModel() {
    return {
      skills: [],
      tools: [],
    };
  }

  buildTheFormSchema() {
    const challengeNames = _.map(this.props.challenges, c => c.title);
    const skillNames = _.map(this.props.skills, s => s.name);
    const toolNames = _.map(this.props.tools, t => t.name);
    const participantNames = _.map(this.props.participants, p => p.username);
    const schema = new SimpleSchema({
      open: {
        type: String,
        allowedValues: ['Open', 'Close'],
        label: 'Availability',
      },
      name: { type: String, label: 'Team Name' },
      image: { type: String, optional: true },
      challenges: { type: Array, label: 'Challenges' },
      'challenges.$': { type: String, allowedValues: challengeNames },
      skills: { type: Array, label: 'Skills', optional: true },
      'skills.$': { type: String, allowedValues: skillNames },
      tools: { type: Array, label: 'Toolsets', optional: true },
      'tools.$': { type: String, allowedValues: toolNames },
      participants: { type: Array, optional: true },
      'participants.$': { type: String, allowedValues: participantNames }, // not sure about the allowed values
      description: String,
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
    // console.log('CreateTeam.submit', formData, this.props);
    const owner = this.props.participant.username;
    const { name, description, challenges, skills, tools, image } = formData;
    let { open } = formData;
    // console.log(challenges, skills, tools, open);
    if (open === 'Open') {
      open = true;
    } else {
      open = false;
      // console.log('FALSE');
    }

    const skillsArr = _.map(skills, n => {
      const doc = Skills.findDoc({ name: n });
      return Slugs.getNameFromID(doc.slugID);
    });
    const toolsArr = _.map(tools, t => {
      const doc = Tools.findDoc({ name: t });
      return Slugs.getNameFromID(doc.slugID);
    });
    const challengesArr = _.map(challenges, title => {
      const doc = Challenges.findDoc({ title });
      return Slugs.getNameFromID(doc.slugID);
    });

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
      challenges: challengesArr,
      skills: skillsArr,
      tools: toolsArr,
    };
    // console.log(collectionName, definitionData);
    defineMethod.call(
        {
          collectionName,
          definitionData,
        },
        error => {
          if (error) {
            swal('Error', error.message, 'error');
            // console.error(error.message);
          } else {
            swal('Success', 'Team created successfully', 'success');
            formRef.reset();
            // console.log(result);
          }
        },
    );
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    const { email } = this.state
    if (!this.props.participant.isCompliant) {
      return (
          <div align={'center'}>
            <Header as='h2' icon>
              <Icon name='thumbs down outline'/>
              You have not agreed to the <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
              &nbsp;or we&apos;ve haven&apos;t received the signed form yet.
              <Header.Subheader>
                You cannot create a team until you do agree to the rules. Please check back later.
              </Header.Subheader>
            </Header>
          </div>
      );
    }
    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(this.buildTheFormSchema());
    const model = this.buildTheModel();
    return (

        <Grid container centered>
          <Grid.Column>
            <Divider hidden />
            <Segment
                style={{
                  borderRadius: '10px',
                  backgroundColor: '#E5F0FE',
                }} className={'createTeam'}>
              <Header as="h2" textAlign="center">Create a Team</Header>
              {/* eslint-disable-next-line max-len */}
              <Message>
                <Header as="h4" textAlign="center">Team name and Devpost page ALL
                  have to use the same name</Header>
              </Message>
            <div>
              <Form onSubmit={this.handleSubmitName}>
                <Form.Group>
                  <Form.Input
                      name={'email'}
                      value={email}
                      placeholder={'add a team member'}
                      onChange={this.handleChange}
                      onSubmit={this.handleSubmitName}
                  />
                <Form.Button fluid
                    content='submit'/>
                </Form.Group>
              </Form>
            </div>
            <AutoForm
                ref={ref => {
                  fRef = ref;
                }}
                schema={formSchema}
                model={model}
                onSubmit={data => this.submit(data, fRef)}
                style={{
                  paddingBottom: '40px',
                }}
            >
                <Grid columns={1} style={{ paddingTop: '20px' }}>
                  <Grid.Column style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                    <Grid className='doubleLine'>
                      <TextField name='name'/>
                      <RadioField
                          name='open'
                          inline
                      />
                    </Grid>
                    <TextField name='image' placeholder={'Team Image URL'} />
                    <LongTextField name='description' />
                    <MultiSelectField name='challenges' />
                    <Grid columns={2}>
                      <Grid.Column><MultiSelectField name='skills' /></Grid.Column>
                      <Grid.Column><MultiSelectField name='tools' /></Grid.Column>
                    </Grid>
                    <TextField name="devpostPage" />
                    <TextField name="affiliation" />
                    <MultiSelectField name='participants' />
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
            </AutoForm>
            </Segment>
          </Grid.Column>
        </Grid>
    );
  }
}

CreateTeamWidget.propTypes = {
  participant: PropTypes.object.isRequired,
  skills: PropTypes.arrayOf(PropTypes.object).isRequired,
  challenges: PropTypes.arrayOf(PropTypes.object).isRequired,
  tools: PropTypes.arrayOf(PropTypes.object).isRequired,
  participants: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withTracker(() => ({
  participant: Participants.findDoc({ userID: Meteor.userId() }),
  challenges: Challenges.find({}).fetch(),
  skills: Skills.find({}).fetch(),
  tools: Tools.find({}).fetch(),
  participants: Participants.find({}).fetch(),
}))(CreateTeamWidget);
