import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Checkbox, Button } from 'semantic-ui-react';
import _ from 'underscore';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import { Participants } from '../../../api/user/ParticipantCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';
import { ROUTES } from '../../../startup/client/route-constants';

class UpdateMinorParticipantsWidget extends React.Component {

  selected;

  constructor(props) {
    super(props);
    this.selected = [];
    this.state = { redirectToReferer: false };
  }

  getMinorParticipants() {
    const MinorParticipantsList = [];
    let MinorParticipant = {};
    _.each(this.props.MinorParticipantsID, function (ParticipantsID) {
      MinorParticipant = Participants._collection.findOne({ _id: ParticipantsID });
      const MinorP = MinorParticipants._collection.findOne({ participantID: ParticipantsID });
      const ParentName = `${MinorP.parentFirstName} ${MinorP.parentLastName} (${MinorP.parentEmail})`;
      MinorParticipant.ParentName = ParentName;
      MinorParticipantsList.push(MinorParticipant);
    });
    return MinorParticipantsList;
  }

  renderMinorParticipants() {

    const CheckBoxFun = {};
    const allMPs = this.props.MinorParticipantsID;
    allMPs.forEach((MP) => {
 CheckBoxFun[MP] = (evt, data) => {
    if (data.checked) this.selected.push(MP);
    // eslint-disable-next-line eqeqeq
    else this.selected = this.selected.filter((Minor) => Minor != MP);
    };
});
    const MinorParticipantsList = this.getMinorParticipants();
    return MinorParticipantsList.map((p) => (<Grid.Row key={p._id} columns={3}>
      <Grid.Column>{ `${p.firstName} ${p.lastName}`}</Grid.Column>
      <Grid.Column>{p.ParentName}</Grid.Column>
      <Grid.Column><Checkbox value={p._id} onClick={(evt, data) => CheckBoxFun[p._id](evt, data)}/></Grid.Column>
    </Grid.Row>));
  }

  submitData() {
    let Error = false;

    this.selected.forEach((MP => {
      const collectionName = Participants.getCollectionName();
      const updateData = {
        id: MP,
        isCompliant: true,
      };

      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          Error = true;
          console.error('Could not update Participant', error);
        }
      });
    }));

    if (!Error) {
      swal('Success', 'Updated successfully', 'success');
     this.setState({ redirectToReferer: true });
    } else swal('Fail', 'Updated fail', 'error');

  }

  render() {
    if (this.state.redirectToReferer) {
      const from = { pathname: ROUTES.LANDING };
      return <Redirect to={from}/>;
    }
    return (
        <div style={{ paddingBottom: '50px' }}>
          <div style={{
            backgroundColor: '#E5F0FE', padding: '1rem 0rem', margin: '2rem 0rem',
            borderRadius: '2rem',
          }}>
          <Header as="h2" textAlign="center">Minor Participants List ({this.props.MinorParticipantsID.length})</Header>
          </div>
          <div style={{
            borderRadius: '1rem',
            backgroundColor: '#E5F0FE',
          }}>
          <Grid celled>
            <Grid.Row columns={3}>
              <Grid.Column>
                <Header>Minor Participant Name</Header>
              </Grid.Column>
              <Grid.Column>
                <Header>Parent Name</Header>
              </Grid.Column>
              <Grid.Column>
                <Header>Compliant</Header>
              </Grid.Column>
            </Grid.Row>
            {this.renderMinorParticipants()}
            <Grid.Row centered>
              <Button type='button' style={{ textAlign: 'center' }} onClick = {() => this.submitData()}>submit</Button>
            </Grid.Row>
          </Grid>
          </div>
        </div>
    );
  }
}

UpdateMinorParticipantsWidget.propTypes = {
  MinorParticipantsID: PropTypes.arrayOf(
      PropTypes.string,
  ),
};

export default UpdateMinorParticipantsWidget;
