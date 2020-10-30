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
import { Administrators } from '../../../api/user/AdministratorCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';

class SuggestToolSkillWidgetAdmin extends React.Component {
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
    const model = this.props.admin;
    newData.username = model.username;
    newData.name = data.name;
    newData.type = data.type;
    newData.description = data.description;
    // console.log(newData);

    defineMethod.call({ collectionName: collectionName, definitionData: newData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Thank you for your suggestion', 'success');
            formRef.reset();
          }
        });
  }

  render() {
    let fRef = null;
    const schema = this.buildTheFormSchema();
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
        <Segment>
          <Header dividing> Add suggestion to list. </Header>
          <AutoForm ref={ref => {
            fRef = ref;
          }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}>
            <Form.Group widths="equal">
              <SelectField name="type" />
            </Form.Group>
              <Form.Group widths="equal">
              <TextField name="name" />
              </Form.Group>
                <Form.Group widths="equal">
              <TextField name="description" />
            </Form.Group>
            <SubmitField />
          </AutoForm>
        </Segment>
    );
  }
}

SuggestToolSkillWidgetAdmin.propTypes = {
  admin: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const admin = Administrators.findDoc({ userID: Meteor.userId() });
  return {
    admin,
  };
})(SuggestToolSkillWidgetAdmin);
