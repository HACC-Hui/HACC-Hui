import React from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SelectField } from 'uniforms-semantic';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Participants } from '../../../api/user/ParticipantCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { deleteAccountMethod, userInteractionDefineMethod } from '../../../api/user/UserInteractionCollection.methods';
import { USER_INTERACTIONS } from '../../../startup/client/user-interaction-constants';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';

class DeleteFormWidget extends React.Component {

  submit(data) {
    const username = this.props.participant.username;
    const type = USER_INTERACTIONS.DELETE_ACCOUNT;
    const typeData = [data.feedback, data.other];
    const userInteraction = {
      username,
      type,
      typeData,
    };
    userInteractionDefineMethod.call(userInteraction, (error) => (error ?
            swal('Error', error.message, 'error') :
            swal('Account deleted', 'We hope to see you again!', 'success')
                .then(() => {
                  // eslint-disable-next-line no-undef
                  window.location = '/';
                })
    ));
    const selector = { owner: this.props.participant._id };
    const ownedTeams = Teams.find(selector).fetch();
    _.forEach(ownedTeams, (team) => {
      const selector2 = { teamID: team._id };
      const teamParticipants = TeamParticipants.find(selector2).fetch();
      if (teamParticipants.length === 1) {
        const instance = team._id;
        const collectionName = Teams.getCollectionName();
        removeItMethod.call({ collectionName, instance });
      } else {
        let newOwner = teamParticipants[0].participantID;
        if (newOwner === this.props.participant._id) {
          newOwner = teamParticipants[1].participantID;
        }
        Teams.update(team._id, { newOwner });
      }
    });
    const collectionName = Participants.getCollectionName();
    const instance = this.props.participant._id;
    removeItMethod.call({ collectionName, instance });
    deleteAccountMethod.call();
  }

  render() {
    const reasons = [
      'No challenge was interesting for me',
      'The challenges were too hard',
      "Couldn't find a team I liked being on",
      'My schedule conflicts with the HACC',
      'Other',
    ];
    const schema = new SimpleSchema({
      feedback: {
        type: String,
        allowedValues: reasons,
        defaultValue: 'Other',
      },
      other: { type: String, required: false },
    });
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Feedback</Header>
            <AutoForm schema={formSchema} onSubmit={data => {
              swal({
                text: 'Are you sure you want to delete your account?',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
              })
                  .then((willDelete) => {
                    if (willDelete) {
                      this.submit(data);
                    } else {
                      swal('Canceled deleting your account');
                    }
                  });
            }}>
              <Segment>
                <Header as="h3">We&apos;re sorry to hear you&apos;re deleting your account.</Header>
                <Header as="h4">Please provide feedback on why you&apos;re leaving
                  to improve the HACC experience for next year.</Header>
                <br/>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <SelectField name='feedback'/>
                    </Grid.Column>
                    <Grid.Column>
                      <LongTextField name='other'/>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Button basic color='red' value='submit'>
                  Delete Account
                </Button>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

DeleteFormWidget.propTypes = {
  participant: PropTypes.object.isRequired,
};

const DeleteFormWidgetCon = withTracker(() => {
  const userID = Meteor.userId();
  let participant;
  if (Participants.isDefined(userID)) {
    participant = Participants.findDoc({ userID: Meteor.userId() });
  } else {
    participant = {};
  }
  return {
    participant,
  };
})(DeleteFormWidget);

export default withRouter(DeleteFormWidgetCon);
