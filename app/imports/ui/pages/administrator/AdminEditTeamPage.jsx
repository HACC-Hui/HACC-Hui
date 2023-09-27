import React from 'react';
import { Card, Container, Form, Table } from 'react-bootstrap';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
} from 'uniforms-bootstrap5';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { useTracker } from 'meteor/react-meteor-data';
import { useRouteMatch } from 'react-router';
import swal from 'sweetalert';

import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import { paleBlueStyle } from '../../styles';

const schema = new SimpleSchema({
  name: String,
  description: String,
  gitHubRepo: String,
});

const AdminEditTeamPage = () => {
  const match = useRouteMatch();
  const { team, members } = useTracker(() => {
    // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
    const documentId = match.params._id;
    const teamDoc = Teams.findDoc(documentId);
    const tParticipants = TeamParticipants.find({
      teamID: teamDoc._id,
    }).fetch();
    const membersDocs = tParticipants.map((tp) =>
      Participants.findDoc(tp.participantID),
    );
    return {
      team: teamDoc,
      members: membersDocs,
    };
  });

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  const handleSubmit = (data) => {
    const { name, description, gitHubRepo } = data;

    const updateData = {};
    updateData.id = data._id;
    updateData.name = name;
    updateData.description = description;
    updateData.gitHubRepo = gitHubRepo;

    const collectionName = Teams.getCollectionName();
    // console.log(updateData);
    // console.log(collectionName);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Item edited successfully', 'success');
      }
    });
  };

  const formSchema = new SimpleSchema2Bridge(schema);
  const memberNamesAndGitHub = members.map((p) => {
    const fullName = Participants.getFullName(p._id);
    const gitHub = p.gitHub;
    return { fullName, gitHub };
  });

  return (
    <Container id="admin-edit-team-page" style={{ paddingTop: `${3}rem` }}>
      <h1 style={{ fontSize: `${24}px`, textAlign: 'center' }}>Edit Team</h1>
      <Card style={paleBlueStyle}>
        <Card.Body>
          <AutoForm schema={formSchema} onSubmit={handleSubmit} model={team}>
            <TextField name="name" disabled />
            <LongTextField name="description" required />
            <Form.Label style={{ fontWeight: 'bold' }}>
              Team Members:
            </Form.Label>
            <Table striped>
              <tbody>
                {memberNamesAndGitHub.map(({ fullName, gitHub }) => (
                  <tr key={`${team.name}-member-${fullName}`}>
                    <td>{fullName}</td>
                    <td>
                      <a href={gitHub}>{gitHub}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <TextField name="gitHubRepo" label="GitHub Repository" required />
            <ErrorsField />
            <SubmitField
              value="Submit"
              inputClassName="btn btn-lg btn-danger w-100"
              style={{ marginTop: `${2}rem` }}
            />
          </AutoForm>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default withAllSubscriptions(AdminEditTeamPage);
