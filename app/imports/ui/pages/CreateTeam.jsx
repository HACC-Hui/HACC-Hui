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
  name: String,
  challenges: { type: Array, label: 'Challenges' },
  'challenges.$': { type: String },
  skills: { type: Array, label: 'Skills' },
  'skills.$': { type: String },
  tools: { type: Array, label: 'Tools' },
  'tools.$': { type: String },
  description: String,
  open: {
    type: String,
    allowedValues: ['Open', 'Closed'],
    label: 'Availability',
  },
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

    const challengesArray = this.props.challenges;
    const challengesObject = [];

    const skillsArray = this.props.skills;
    const skillsObject = [];

    const toolsArray = this.props.tools;
    const toolsObject = [];

    const owner = this.props.developer[0].slugID;

    let {
      name, description, open, challenges, skills, tools,
    } = definitionData;

    if (open === 'Yes') {
      open = true;
    } else {
      open = false;
      console.log('False');
    }

    for (let i = 0; i < challengesArray.length; i++) {
      for (let j = 0; j < challenges.length; j++) {
        if (challengesArray[i].name === challenges[j]) {
          challengesObject.push(challengesArray[i].slugID);
        }
      }
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

    defineMethod.call({
      collectionName: Teams.getCollectionName(),
      definitionData: {
        name,
        description,
        owner,
        open,
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
        swal('Success', 'success', 'Team made successfully');
        formRef.reset();
        console.log('Success');
      }
    });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(schema);

    const challengesArray = _.map(this.props.challenges, 'title');
    const skillsArray = _.map(this.props.skills, 'name');
    const toolsArray = _.map(this.props.tools, 'name');
    return (
        <div>
          <Grid container centered>
            <Grid.Column>
              <Header as="h2" textAlign="center">Create a Team</Header>
              <AutoForm ref={ref => {fRef = ref;}} schema={formSchema} onSubmit={data => this.submit(data, fRef)}>
                <Segment>
                  <TextField name='name'/>
                  <MultiSelectField name='challenges' placeholder={'Challenges'}
                                    allowedValues={challengesArray} required/>
                  <MultiSelectField name='skills' placeholder={'Skills'}
                                    allowedValues={skillsArray}required/>
                  <MultiSelectField name='tools' placeholder={'Tools'}
                                    allowedValues={toolsArray} required/>
                  <RadioField name='open'></RadioField>
                  <LongTextField name='description'/>
                  <SubmitField value='Submit'/>
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
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  developer: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
}

export default withTracker(() => {
  const sub1 = Challenges.subscribe();
  const sub2 = Skills.subscribe();
  const sub3 = Tools.subscribe();
  const sub4 = Developers.subscribe();
  return {
    challenges: Challenges.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    developer: Developers.find({}).fetch(),
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
  };
})(CreateTeam);
