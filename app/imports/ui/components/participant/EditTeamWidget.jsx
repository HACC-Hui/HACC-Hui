import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router';
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
  SelectField,
} from 'uniforms-semantic';
import Swal from 'sweetalert2';
import { Teams } from '../../../api/team/TeamCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import MultiSelectField from '../form-fields/MultiSelectField';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import RadioField from '../form-fields/RadioField';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { CanChangeChallenges } from '../../../api/team/CanChangeChallengeCollection';

class EditTeamWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirectToReferer: false };
  }

  buildTheFormSchema() {
    const challengeNames = _.map(this.props.allChallenges, (c) => c.title);
    const skillNames = _.map(this.props.allSkills, (s) => s.name);
    const toolNames = _.map(this.props.allTools, (t) => t.name);
    const participantNames = _.map(this.props.participants, (p) => p.username);
    const schema = new SimpleSchema({
      open: {
        type: String,
        allowedValues: ['Open', 'Close'],
        label: 'Availability',
      },
      name: { type: String },
      challenge: { type: String, allowedValues: challengeNames, optional: true },
      skills: { type: Array, label: 'Skills', optional: true },
      'skills.$': { type: String, allowedValues: skillNames },
      tools: { type: Array, label: 'Toolsets', optional: true },
      'tools.$': { type: String, allowedValues: toolNames },
      members: { type: Array, optional: true },
      'members.$': { type: String, allowedValues: participantNames },
      description: String,
      gitHubRepo: { type: String, optional: true },
      devPostPage: { type: String, optional: true },
      affiliation: { type: String, optional: true },
    });
    return schema;
  }

  buildTheModel() {

    const model = this.props.team;
    // console.log(model);
    model.challenges = _.map(this.props.challenges, (challenge) => challenge.title);
    model.challenge = this.props.team.challenges[0];
    model.skills = _.map(this.props.skills, (skill) => skill.name);
    model.tools = _.map(this.props.tools, (tool) => tool.name);
    if (model.open) {
      model.open = 'Open';
    } else {
      model.open = 'Close';
    }
    model.members = _.uniq(_.map(this.props.members, (m) => m.username));
    // console.log('model', model);
    return model;
  }

  submitData(data) {
    // console.log('submit', data);
    const collectionName = Teams.getCollectionName();
    const updateData = {};
    // description, challenges, skills, tools, image, open
    updateData.id = data._id;
    updateData.name = data.name;
    updateData.description = data.description;
    updateData.gitHubRepo = data.gitHubRepo;
    updateData.devPostPage = data.devPostPage;
    updateData.affiliation = data.affiliation;
    updateData.open = data.open === 'Open';
    if (data.challenge) {
      // build an array of challenge slugs
      updateData.challenges = [];
      const doc = Challenges.findDoc({ title: data.challenge });
      updateData.challenges.push(Slugs.getNameFromID(doc.slugID));
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
    if (data.members) {
      updateData.participants = data.members;
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
    // console.log(model);
    return (
        <Grid container centered>
          <Grid.Column>
            <Divider hidden />
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} model={model} onSubmit={(data) => {
              // console.log('submit', data);
              this.submitData(data, fRef);
            }}
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
                    <LongTextField name='description' />
                    <SelectField name='challenge' disabled={!this.props.canChangeChallenges} />
                    <Grid columns={2}>
                      <Grid.Column><MultiSelectField name='skills' /></Grid.Column>
                      <Grid.Column><MultiSelectField name='tools' /></Grid.Column>
                    </Grid>
                    <TextField name="gitHubRepo" label="GitHub Repo" disabled />
                    <TextField name="devPostPage" label="Devpost Page" />
                    <TextField name="affiliation" />
                    <MultiSelectField name='members' />
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
  allChallenges: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  challenges: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  team: PropTypes.object.isRequired,
  skills: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  allSkills: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  allTools: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  teamSkills: PropTypes.arrayOf(
      PropTypes.object,
  ),
  tools: PropTypes.arrayOf(
      PropTypes.object,
  ),
  members: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  participants: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  canChangeChallenges: PropTypes.bool.isRequired,
};

const EditTeamCon = withTracker(({ match }) => {
  // console.log(match);
  const teamID = match.params._id;
  const team = Teams.findDoc(teamID);
  const challengeIDs = TeamChallenges.find({ teamID }).fetch();
  const challenges = _.map(challengeIDs, (doc) => Challenges.findDoc(doc.challengeID));
  const skillIDs = TeamSkills.find({ teamID }).fetch();
  const skills = _.map(skillIDs, (id) => Skills.findDoc(id.skillID));
  const toolIDs = TeamTools.find({ teamID }).fetch();
  const tools = _.map(toolIDs, (id) => Tools.findDoc(id.toolID));
  const memberIDs = TeamParticipants.find({ teamID }).fetch();
  const members = _.map(memberIDs, (id) => Participants.findDoc(id.participantID));
  const participants = Participants.find({}).fetch();
  const allChallenges = Challenges.find({}).fetch();
  const allSkills = Skills.find({}).fetch();
  const allTools = Tools.find({}).fetch();
  const canChangeChallenges = CanChangeChallenges.findOne().canChangeChallenges;
  // console.log(team);
  return {
    team,
    skills,
    challenges,
    tools,
    members,
    participants,
    allChallenges,
    allSkills,
    allTools,
    canChangeChallenges,
  };
})(EditTeamWidget);

export default withRouter(EditTeamCon);
