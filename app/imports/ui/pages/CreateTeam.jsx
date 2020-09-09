import React from 'react';
import { Grid, Segment, Header, Loader } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
} from 'uniforms-semantic';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'lodash';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../controllers/MultiSelectField';
import RadioField from '../controllers/RadioField';
import { Teams } from '../../api/team/TeamCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Skills } from '../../api/skill/SkillCollection';
import { Tools } from '../../api/tool/ToolCollection';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { Developers } from '../../api/user/DeveloperCollection';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  open: {
    type: String,
    allowedValues: ['Yes', 'No'],
  },
  name: String,
  image: String,
  challenges: { type: Array, label: 'Challenges' },
  'challenges.$': { type: String },
  skills: { type: Array, label: 'Skills' },
  'skills.$': { type: String },
  tools: { type: Array, label: 'Toolsets' },
  'tools.$': { type: String },
  description: String,
});

/**
 * Renders the Page for adding teams.
 * @memberOf ui/pages
 */
class CreateTeam extends React.Component {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(definitionData, formRef) {

    console.log('CreateTeam.submit', definitionData);
    const skillsArray = this.props.skills;
    const skillsObject = [];

    const toolsArray = this.props.tools;
    const toolsObject = [];

    const challengesArray = this.props.challenges;
    const challengesObject = [];

    const owner = this.props.developer[0].slugID;

    let {
      name, description, open, challenges, skills, tools, image,
    } = definitionData;

    if (open === 'Yes') {
      open = true;
    } else {
      console.log('FALSE');
      open = false;
    }

    for (let i = 0; i < skillsArray.length; i++) {
      for (let j = 0; j < skills.length; j++) {
        if (skillsArray[i].name === skills[j]) {
          skillsObject.push(skillsArray[i].slugID);
        }
      }
    }

    for (let i = 0; i < toolsArray.length; i++) {
      for (let j = 0; j < tools.length; j++) {
        if (toolsArray[i].name === tools[j]) {
          toolsObject.push(toolsArray[i].slugID);
        }
      }
    }

    for (let i = 0; i < challengesArray.length; i++) {
      for (let j = 0; j < challenges.length; j++) {
        if (challengesArray[i].name === tools[j]) {
          challengesObject.push(challengesArray[i].slugID);
        }
      }
    }

    // If the name has special character or space, throw a swal error and return early.
    if (/^[a-zA-Z0-9-]*$/.test(name) === false) {
      swal('Error', 'Sorry, no special characters or space allowed.', 'error');
      return;
    }

    defineMethod.call({
          collectionName: Teams.getCollectionName(),
          definitionData: {
            name,
            description,
            owner,
            open,
            image,
            challengesObject,
            skillsObject,
            toolsObject,
          },
        },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
            console.error(error.message);
          } else {
            swal('Success', 'Team created successfully', 'success');
            formRef.reset();
            console.log('Success');
          }
        });

    // console.log(docID);
  }

  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(schema);

    const skillsArray = _.map(this.props.skills, 'name');
    const toolsArray = _.map(this.props.tools, 'name');
    const challengesArray = _.map(this.props.challenges, 'title');

    return (
        <div style={{ backgroundColor: '#C4C4C4' }}>
          <Grid container centered>
            <Grid.Column>
              <div style={{
                backgroundColor: '#393B44', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem',
              }}>
                <Header as="h2" textAlign="center" inverted>Team Creation</Header>
              </div>
              <AutoForm ref={ref => {
                fRef = ref;
              }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}
                        style={{
                          paddingBottom: '4rem',
                        }}>
                <Segment style={{
                  borderRadius: '1rem',
                  backgroundColor: '#393B44',
                }} className={'teamCreate'}>
                  <Grid columns={2} style={{ paddingTop: '2rem' }}>
                    <Grid.Column style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                      <TextField name='name'/>
                      <MultiSelectField name='challenges' placeholder={'Challenges'}
                                        allowedValues={challengesArray} required/>
                      <MultiSelectField name='skills' placeholder={'Skills'}
                                        allowedValues={skillsArray} required/>
                      <MultiSelectField name='tools' placeholder={'Toolsets'}
                                        allowedValues={toolsArray} required/>
                    </Grid.Column>
                    <Grid.Column style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                      <RadioField
                          name='open'
                          inline
                      >
                      </RadioField>
                       <TextField name='image' placeholder={'Team Image URL'}/>
                      <LongTextField name='description'/>
                    </Grid.Column>
                  </Grid>
                  <div align='center'>
                    <SubmitField value='Submit'
                                 style={{
                                   color: 'white', backgroundColor: '#24252B',
                                   margin: '2rem 0rem',
                                 }}/>
                  </div>
                  <ErrorsField/>
                </Segment>
              </AutoForm>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

CreateTeam.propTypes = {
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  developer: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// export default CreateTeam;
export default withTracker(() => {
  const subscription = Skills.subscribe();
  const subscription1 = Tools.subscribe();
  const subscription2 = Challenges.subscribe();
  const subscription3 = Developers.subscribe();
  return {
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    developer: Developers.find({}).fetch(),
    ready: subscription.ready() && subscription1.ready() && subscription2.ready() && subscription3.ready(),
  };
})(CreateTeam);
