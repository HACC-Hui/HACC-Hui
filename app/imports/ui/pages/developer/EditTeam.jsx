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
import { Teams } from '../../../api/team/TeamCollection';
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
    const { open, image, challenges,
      skills, tools, description, gitHub, devpostPage, _id } = data;

    const challengesList = _.map(this.props.challenges, 'title');
    const challengeIds = [];
    const skillsList = _.map(this.props.skills, 'name');
    const skillIds = [];
    const toolsList = _.map(this.props.tools, 'name');
    const toolIds = [];

    if (challenges) {
      for (let i = 0; i < challengesList.length; i++) {
        for (let j = 0; j < challenges.length; j++) {
          if (challengesList[i].title === challenges[j]) {
            challengeIds.push(challengesList[i].slugID);
          }
        }
      }
    }

    if (skills) {
      for (let i = 0; i < skillsList.length; i++) {
        for (let j = 0; j < skills.length; j++) {
          if (skillsList[i].name === skills[j]) {
            skillIds.push(skillsList[i].slugID);
          }
        }
      }
    }

    if (tools) {
      for (let i = 0; i < toolsList.length; i++) {
        for (let j = 0; j < tools.length; j++) {
          if (toolsList[i].name === tools[j]) {
            toolIds.push(toolsList[i].slugID);
          }
        }
      }
    }

    const updateData = {
      id: _id,
      challenges: challengeIds,
      skills: skillIds,
      tools: toolIds,
      open,
      image,
      description,
      gitHub,
      devpostPage,
    };
    updateMethod.call({ collectionName: Teams.getCollectionName(), updateData: updateData }, (error) => (error ?
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
    const teamsChal = [];
    const teamsSkill = [];
    const teamsTool = [];
    // add the teams challenges, skills, tools in the edit form
    _.forEach(this.props.teamChallenges, (c) => _.forEach(this.props.challenges, (p) => {
      // eslint-disable-next-line no-unused-expressions
          (c.challengeID === p._id) ? teamsChal.push(p.title) : '';
        }));

    _.forEach(this.props.teamSkills, (c) => _.forEach(this.props.skills, (p) => {
      // eslint-disable-next-line no-unused-expressions
          (c.skillID === p._id) ? teamsSkill.push(p.name) : '';
        }));

    _.forEach(this.props.teamTools, (c) => _.forEach(this.props.tools, (p) => {
      // eslint-disable-next-line no-unused-expressions
          (c.toolID === p._id) ? teamsTool.push(p.name) : '';
        }));

    eTeam.tools = teamsTool;
    eTeam.skills = teamsSkill;
    eTeam.challenges = teamsChal;
    console.log(eTeam);
    return (
        <Grid container centered>
          <Grid.Column>
            <Divider hidden />
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}
                      style={{
                        paddingBottom: '40px',
                      }}>
              <Segment style={{
                borderRadius: '10px',
              }} className={'createTeam'}>
                <Grid columns={1} style={{ paddingTop: '20px' }}>
                  <Grid.Column style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                    <Header as="h2" textAlign="center">Team Information</Header>
                    <Grid className='doubleLine'>
                      <RadioField
                          name='open'
                          inline
                      />
                    </Grid>
                    <TextField name='image' placeholder={'Team Image URL'} />
                    <LongTextField name='description' />
                    <MultiSelectField name='challenges' placeholder={'Challenges'}
                                      allowedValues={challengeArr} required />
                    <MultiSelectField name='skills' placeholder={'Skills'}
                                      allowedValues={skillArr} required />
                    <MultiSelectField name='tools' placeholder={'Toolsets'}
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
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  teamChallenges: PropTypes.array.isRequired,
  teamSkills: PropTypes.array.isRequired,
  teamTools: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,

};

export default withTracker(() => {
  // Get access to documents.
  const toolsSubscription = Tools.subscribe();
  const skillsSubscription = Skills.subscribe();
  const teamSubscription = Teams.subscribe();
  const challengesSubscription = Challenges.subscribe();
  const teamToolsSubscription = TeamTools.subscribe();
  const teamSkillsSubscription = TeamSkills.subscribe();
  const teamChallengesSubscription = TeamChallenges.subscribe();
  return {
    tools: Tools.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    team: Teams.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    teamTools: TeamTools.find({}).fetch(),
    teamSkills: TeamSkills.find({}).fetch(),
    teamChallenges: TeamChallenges.find({}).fetch(),
    ready: toolsSubscription.ready() && skillsSubscription.ready() &&
        teamSubscription.ready() && challengesSubscription.ready() &&
        teamToolsSubscription.ready() &&
        teamSkillsSubscription.ready() && teamSubscription.ready() &&
        teamChallengesSubscription.ready(),
  };
})(EditTeam);
