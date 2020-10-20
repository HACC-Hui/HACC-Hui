import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
//  import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Divider, Grid, Header, Message, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  ErrorsField,
  LongTextField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import Swal from 'sweetalert2';
import { Teams } from '../../../api/team/TeamCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import MultiSelectField from '../form-fields/MultiSelectField';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import RadioField from '../form-fields/RadioField';

class EditTeamWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirectToReferer: false };
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

  buildTheModel() {
    // const model = this.props.team;
    const model = this.props.participant;
    model.Challenges = _.map(this.props.challenges, (challenge) => challenge.title);
    model.Skills = _.map(this.props.skills, (skill) => 
      // console.log(skill);
       skill.name
    );
    model.Tools = _.map(this.props.tools, (tool) => tool.name);
    return model;
  }

  submitData(data) {
    console.log('submit', data);
    const collectionName = Teams.getCollectionName();
    const updateData = {};
    // name, description, challenges, skills, tools, image, open
    updateData.id = data._id;
    updateData.name = data.name;
    if (data.challenges) {
      // build an array of challenge slugs
      updateData.challenges = data.challenges.map((title) => {
        const doc = Challenges.findDoc({ title });
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
    if (data.image) {
      updateData.image = data.image;
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
          text: 'Team updated.',
        });
      }
    });
    this.setState({ redirectToReferer: true });
  }

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
                backgroundColor: '#E5F0FE',
              }} className={'createTeam'}>
                <Grid columns={1} style={{ paddingTop: '20px' }}>
                  <Grid.Column style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                    <Header as="h2" textAlign="center">Edit Team</Header>
                    <Message>
                      <Header as="h4" textAlign="center">Team name and Devpost page ALL
                        have to use the same name</Header>
                    </Message>
                    <Grid className='doubleLine'>
                      <TextField name='name' />
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
                    <TextField name="github" />
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
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

EditTeamWidget.propTypes = {
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

/* export default withTracker(( { match } ) => ({
*  const documentId = Teams.findOne({match.params._id});
*  const teamChallenges = teamChallenges.find({ participantID }).fetch();
*  const teamSkills = teamSkills.find({ participantID }).fetch();
*  const teamTools = teamTools.find({ participantID }).fetch();
*  return {
*
*   documentId,
*    teamChallenges,
*    teamSkills,
*    teamTools,
*  };
*}))(EditTeamWidget);
*/

export default withTracker(() => ({
  participant: Participants.findDoc({ userID: Meteor.userId() }),
  challenges: Challenges.find({}).fetch(),
  skills: Skills.find({}).fetch(),
  tools: Tools.find({}).fetch(),
  participants: Participants.find({}).fetch(),
}))(EditTeamWidget);