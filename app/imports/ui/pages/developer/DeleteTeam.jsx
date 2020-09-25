import { Meteor } from "meteor/meteor";
import React from "react";
import { Grid, Segment, Header } from "semantic-ui-react";
import {
  AutoForm,
  ErrorsField,
  LongTextField,
  SelectField
} from "uniforms-semantic";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import { SimpleSchema2Bridge } from "uniforms-bridge-simple-schema-2";
import SimpleSchema from "simpl-schema";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import swal from "sweetalert";
import { removeItMethod } from "../../../api/base/BaseCollection.methods";
import { Teams } from "../../../api/team/TeamCollection";
import {
  deleteAccountMethod,
  userInteractionDefineMethod
} from "../../../api/user/UserInteractionCollection.methods";
import { USER_INTERACTIONS } from "../../../startup/client/user-interaction-constants";
import { deleteTeamMethod } from "../../../api/team/TeamCollection.methods";

/**
 * Renders the Page for deleting a user. **deprecated**
 * @memberOf ui/pages
 */
class DeleteTeam extends React.Component {
  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   */
  submit(data) {
    const username = this.props.doc.username;
    const type = USER_INTERACTIONS.DELETE_ACCOUNT;
    const typeData = [data.feedback, data.other];
    const userInteraction = {
      username,
      type,
      typeData
    };
    userInteractionDefineMethod.call(userInteraction, error =>
      error
        ? swal("Error", error.message, "error")
        : swal("Team deleted", "We hope to see you again!", "success").then(
            () => {
              // eslint-disable-next-line no-undef
              window.location = "/";
              // Meteor.logout();
            }
          )
    );
    const collectionName = Teams.getCollectionName();
    const instance = this.props.doc._id;
    // console.log(collectionName, instance);
    removeItMethod.call({ collectionName, instance });
    deleteTeamMethod.call();
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    // Create a schema to specify the structure of the data to appear in the form.
    const schema = new SimpleSchema({
      feedback: {
        type: String,
        defaultValue: "Other"
      },
      other: { type: String, required: false }
    });
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
      <Grid container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center">
            Feedback
          </Header>
          <AutoForm
            schema={formSchema}
            onSubmit={data => {
              swal({
                text: "Are you sure you want to delete your team?",
                icon: "warning",
                buttons: true,
                dangerMode: true
              }).then(willDelete => {
                if (willDelete) {
                  this.submit(data);
                } else {
                  swal("Canceled deleting your team");
                }
              });
            }}
          >
            <Segment>
              <Button basic color="red" value="submit">
                Delete Team
              </Button>
              <ErrorsField />
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

/**
 * Require the presence of a DeleteTeam document in the props object. Uniforms adds 'model' to the props, which we
 * use.
 */
DeleteTeam.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Team documents.
  const subscription = Meteor.subscribe("Teams");
  return {
    doc: Teams.findOne(documentId),
    ready: subscription.ready()
  };
})(DeleteTeam);
