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
import swal from 'sweetalert';
import { Participants } from '../../../api/user/ParticipantCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';

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

  submit(data, formRef) {
    // console.log('CreateProfileWidget.submit', data);
    const collectionName = Suggestions.getCollectionName();
    const newData = {};
    const model = this.props.participant;
    newData.username = model.username;
    newData.name = data.name;
    newData.type = data.type;
    newData.description = data.description;
    console.log(newData);

    defineMethod.call({ collectionName: collectionName, definitionData: newData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
            // console.error(error.message);
          } else {
            swal('Success', 'Thank you for your suggestion', 'success');
            formRef.reset();
            // console.log('Success');
          }
        });
  }

  render() {
    let fRef = null;
    // console.log(this.props);
    const model = this.props.participant;
    // console.log(model);
    const schema = this.buildTheFormSchema();
    const formSchema = new SimpleSchema2Bridge(schema);
    const firstname = model.firstName;
    return (
        <Segment>
          <Header dividing>Hello {firstname}, please fill out the form to suggest a new tool or skill. </Header>
          <AutoForm ref={ref => {
            fRef = ref;
          }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}>
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
};

export default withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  return {
    participant,
  };
})(SuggestToolSkillWidget);
