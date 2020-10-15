import React from 'react';
import { Grid, Segment, Header, Divider } from 'semantic-ui-react';
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
    this.state = { redirectToReferer: false };
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
    const participantNames = _.map(this.props.participants, (p) => p.username);
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
      participants: { type: Array, optional: true },
      'participants.$': { type: String, allowedValues: participantNames }, // not sure about the allowed values
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
    // console.log('CreateTeam.submit', formData, this.props);
    const owner = this.props.participant.username;
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

    const skillsArr = _.map(skills, (n) => {
      const doc = Skills.findDoc({ name: n });
      return Slugs.getNameFromID(doc.slugID);
    });
    const toolsArr = _.map(tools, (t) => {
      const doc = Tools.findDoc({ name: t });
      return Slugs.getNameFromID(doc.slugID);
    });
    const challengesArr = _.map(challenges, (title) => {
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
            // console.log(result);
          }
        });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(this.buildTheFormSchema());
    const model = this.buildTheModel();
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
                backgroundColor: '#9AFEFF',
              }} className={'createTeam'}>
                <Grid columns={1} style={{ paddingTop: '20px' }}>
                  <Grid.Column style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                    <Header as="h2" textAlign="center">Create a Team</Header>
                    <Grid className='doubleLine'>
                      <TextField name='name' />
                      <RadioField
                          name='open'
                          inline
                      />
                    </Grid>
                    <TextField name='image' placeholder={'Team Image URL'} />
                    <LongTextField name='description' placeholder={'Description of Team'}/>
                    <MultiSelectField name='challenges' />
                    <Grid columns={2}>
                      <Grid.Column><MultiSelectField name='skills' /></Grid.Column>
                      <Grid.Column><MultiSelectField name='tools' /></Grid.Column>
                    </Grid>
                    <TextField name="github" placeholder={'Github URL'} />
                    <TextField name="devpostPage" placeholder={'Devpost Page URL'} />
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
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

CreateTeamWidget.propTypes = {
  participant: PropTypes.object.isRequired,
  skills: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  challenges: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  tools: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  participants: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
};

export default withTracker(() => ({
  participant: Participants.findDoc({ userID: Meteor.userId() }),
  challenges: Challenges.find({}).fetch(),
  skills: Skills.find({}).fetch(),
  tools: Tools.find({}).fetch(),
  participants: Participants.find({}).fetch(),
}))(CreateTeamWidget);
