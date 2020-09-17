import React from 'react';
import { Segment } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-semantic';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { Developers } from '../../api/user/DeveloperCollection';

class EditProfile extends React.Component {

  submit(data) {
    this.props.handleClick(data);
  }

  render() {
    const formSchema = new SimpleSchema2Bridge(Developers.getSchema());
    return (
        <AutoForm schema={formSchema} onSubmit={data => this.submit(data)}>
          <Segment>
            <TextField name='firstName'/>
            <TextField name='lastName'/>
            <SubmitField value='Submit'/>
            <ErrorsField/>
          </Segment>
        </AutoForm>
    );
  }
}

/** Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use. */
EditProfile.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Developers documents.
  const subscription = Developers.subscribe();
  return {
    doc: Developers.findOne(documentId),
    ready: subscription.ready(),
  };
})(EditProfile);
