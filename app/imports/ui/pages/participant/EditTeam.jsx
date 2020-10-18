import React from 'react';
import _ from 'lodash';
import { Grid, Segment, Loader, Divider, Header } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, SubmitField,
  TextField, LongTextField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import MultiSelectField from '../../components/form-fields/MultiSelectField';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import RadioField from '../../components/form-fields/RadioField';

// added challenges, skills, tools fields to the team schema
const schema = new SimpleSchema({
  open: {
    type: String,
    allowedValues: ['Open', 'Close'],
    label: 'Availability',
  },
  name: { type: String },
  image: { type: String, optional: true },
  challenges: { type: Array, label: 'Challenges' },
  'challenges.$': { type: String },
  skills: { type: Array, label: 'Skills' },
  'skills.$': { type: String },
  tools: { type: Array, label: 'Toolsets' },
  'tools.$': { type: String },
  description: String,
  github: { type: String, optional: true },
  devpostPage: { type: String, optional: true },
});

const fetchChalls = (team) => {
  const teamID = team._id;
  const challengeStored = TeamChallenges.find({ teamID }).fetch();
  const challengeExamples = challengeStored.map((tc) => Challenges.findDoc(tc.challengeID).title);
  return challengeExamples;
};

const fetchSkills = (team) => {
  const teamID = team._id;
  const skillsStored = TeamSkills.find({ teamID }).fetch();
  const skillExamples = skillsStored.map((ts) => Skills.findDoc(ts.skillID).name);
  return skillExamples;
};

const fetchTools = (team) => {
  const teamID = team._id;
  const teamStored = TeamTools.find({ teamID }).fetch();
  const toolExamples = teamStored.map((tt) => Tools.findDoc(tt.toolID).name);
  return toolExamples;
};

/**
 * A simple edit page thats prefilled with any info about the team.
 * @memberOf ui/pages
 */
class EditTeam extends React.Component {

  /**
   * On successful submit, insert the data.
   * @param data {Object} the result from the form.
   */
  submit(data) {
    const { name, description, challenges,
      skills, tools, image, _id } = data;
    const owner = this.props.developers[0].slugID;
    const challengesList = this.props.challenges;
    const challengeIds = [];
    const skillsList = this.props.skills;
    const skillIds = [];
    const toolsList = this.props.tools;
    const toolIds = [];
    let { open } = data;
    if (/^[a-zA-Z0-9-]*$/.test(name) === false) {
      swal('Error', 'Sorry, no special characters or space allowed.', 'error');
      return;
    }
    if (open === 'Open') {
      open = true;
    } else {
      open = false;
    }

      for (let i = 0; i < challengesList.length; i++) {
        for (let j = 0; j < challenges.length; j++) {
          if (challengesList[i].title === challenges[j]) {
            challengeIds.push(Slugs.getNameFromID(challengesList[i].slugID));
          }
        }
      }

      for (let i = 0; i < skillsList.length; i++) {
        for (let j = 0; j < skills.length; j++) {
          if (skillsList[i].name === skills[j]) {
            skillIds.push(Slugs.getNameFromID(skillsList[i].slugID));
          }
        }
      }

      for (let i = 0; i < toolsList.length; i++) {
        for (let j = 0; j < tools.length; j++) {
          if (toolsList[i].name === tools[j]) {
            toolIds.push(Slugs.getNameFromID(toolsList[i].slugID));
          }
        }
      }
    const collectionName = Teams.getCollectionName();
    const updateData = {
      id: _id,
      name,
      challenges: challengeIds,
      skills: skillIds,
      tools: toolIds,
      description,
      owner,
      open,
      image,
    };
    updateMethod.call({ collectionName, updateData }, (error) => (error ?
        swal('Error', error.message, 'error') :
        swal('Success', 'Item updated successfully', 'success')));
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(schema);
    const challengeArr = _.map(this.props.challenges, 'title');
    const skillArr = _.map(this.props.skills, 'name');
    const toolArr = _.map(this.props.tools, 'name');
    const eTeam = Teams.findOne();
    console.log(eTeam);
    return (
        <Grid container centered>
          <Grid.Column>
            <Divider hidden />
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}
                      model={this.props.doc}
                      style={{
                        paddingBottom: '40px',
                      }}>
              <Segment style={{
                borderRadius: '10px',
              }}>
                <Grid columns={1} style={{ paddingTop: '20px' }}>
                  <Grid.Column style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                    <Header as="h2" textAlign="center">Team Information</Header>
                    <Grid className='doubleLine'>
                      <TextField name='name' />
                      <RadioField
                          name='open'
                          inline
                      />
                    </Grid>
                    <TextField name='image' placeholder={'Team Image URL'} />
                    <LongTextField name='description' />
                    <MultiSelectField name='challenges' placeholder={fetchChalls(this.props.teamChallenges)}
                                      allowedValues={challengeArr} required />
                    <MultiSelectField name='skills' placeholder={fetchSkills(this.props.teamSkills)}
                                      allowedValues={skillArr} required />
                    <MultiSelectField name='tools' placeholder={fetchTools(this.props.teamTools)}
                                      allowedValues={toolArr} required />
                    <TextField name="github" />
                    <TextField name="devpostPage" />
                  </Grid.Column>
                </Grid>
                <div align='center'>
                  <SubmitField value='Submit'
                               style={{
                                 color: 'white', backgroundColor: '#60646b',
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

EditTeam.propTypes = {
  doc: PropTypes.object,
  currentUser: PropTypes.string,
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  developers: PropTypes.array.isRequired,
  teamChallenges: PropTypes.array.isRequired,
  teamSkills: PropTypes.array.isRequired,
  teamTools: PropTypes.array.isRequired,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,

};

export default withTracker(({ match }) => {
  // Get access to documents.
  const documentId = match.params._id;
  const toolsSubscription = Tools.subscribe();
  const skillsSubscription = Skills.subscribe();
  const challengesSubscription = Challenges.subscribe();
  const subscriptionDevelopers = Developers.subscribe();
  return {
    doc: Teams.findOne(documentId),
    tools: Tools.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    team: Teams.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    teamTools: TeamTools.find({}).fetch(),
    teamSkills: TeamSkills.find({}).fetch(),
    teamChallenges: TeamChallenges.find({}).fetch(),
    developers: Developers.find({}).fetch(),
    ready: toolsSubscription.ready() && skillsSubscription.ready() &&
        challengesSubscription.ready() && subscriptionDevelopers.ready(),
  };
})(EditTeam);
