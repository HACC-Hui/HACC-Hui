import React from 'react';
import { Header, Segment, Form } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  AutoForm,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { Skills } from '../../../api/skill/SkillCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

class SuggestToolSkillWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirectToReferer: false };
  }

  buildTheFormSchema() {
    const schema = new SimpleSchema({
      type: { type: String, allowedValues: ['Tool', 'Skill'], optional: false },
      name: String,
      description: String,
    });
    return schema;
  }

  submit(data) {
    // console.log('CreateProfileWidget.submit', data);
    let collectionName;
    const newData = {};
    // firstName, lastName, demographicLevel, lookingForTeam, challenges, interests,
    //     skills, tools, linkedIn, gitHub, website, aboutMe,
    newData.username = this.props.participant.username;
    if (data.type === 'Tool') {
      collectionName = Tools.getCollectionName();
      newData.type = data.type;
      newData.description = data.description;
    }
    if (data.type === 'Skill') {
      collectionName = Skills.getCollectionName();
      newData.type = data.type;
      newData.description = data.description;
    }

    defineMethod.call({ collectionName, newData }, (error) => {
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
          text: 'Your suggestion has been added.',
        });
      }
    });
    this.setState({ redirectToReferer: true });
  }

  render() {
    // console.log(this.props);
    const model = this.props.participant;
    // console.log(model);
    const schema = this.buildTheFormSchema();
    const formSchema = new SimpleSchema2Bridge(schema);
    const firstname = model.firstName;
    return (
        <Segment>
          <Header dividing>Hello {firstname}, please fill out the form to suggest a new tool or skill. </Header>
          <AutoForm schema={formSchema} model={model} onSubmit={data => {
            // console.log(data);
            this.submit(data);
          }}>
            <Form.Group widths="equal">
              <SelectField name="type" />
              <TextField name="name" />
              <TextField name="description" />
            </Form.Group>
            <SubmitField />
          </AutoForm>
        </Segment>
    );
  }
}

SuggestToolSkillWidget.propTypes = {
  participant: PropTypes.object.isRequired,
  skills: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  tools: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
};

export default withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  const skills = Skills.find({}).fetch();
  const tools = Tools.find({}).fetch();
  return {
    participant,
    skills,
    tools,
  };
})(SuggestToolSkillWidget);
