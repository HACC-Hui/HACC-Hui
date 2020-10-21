import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Checkbox, Button } from 'semantic-ui-react';
import _ from 'underscore';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import { Participants } from '../../../api/user/ParticipantCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROUTES } from '../../../startup/client/route-constants';

class UpdateMinorParticipantsWidget extends React.Component {

  selected;

  constructor(props) {
    super(props);
    this.selected = [];
    this.state = { redirectToReferer: false };
  }

  getMinorParticipants() {
    const MinorParticipants = [];
    let MinorParticipant = {};
    _.each(this.props.MinorParticipantsID, function (ParticipantsID) {
      MinorParticipant = Participants._collection.findOne({ _id: ParticipantsID });
      MinorParticipants.push(MinorParticipant);
    });
    return MinorParticipants;
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
    const MinorParticipants = this.getMinorParticipants();
    return MinorParticipants.map((p) => (<Grid.Row key={p._id} columns={3}>
      <Grid.Column>{p.firstName}</Grid.Column>
      <Grid.Column>{p.lastName}</Grid.Column>
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
      swal('Success', 'updated successfully', 'success');
     this.setState({ redirectToReferer: true });
    } else swal('Fail', 'updated fail', 'error');

  }

  render() {
    if (this.state.redirectToReferer) {
      const from = { pathname: ROUTES.LANDING };
      return <Redirect to={from}/>;
    }
    return (
        <div>
          <Header>Minor Participants List</Header>
          <Grid celled>
            <Grid.Row columns={3}>
              <Grid.Column>
                <Header>First Name</Header>
              </Grid.Column>
              <Grid.Column>
                <Header>Last Name</Header>
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
    );
  }
}

UpdateMinorParticipantsWidget.propTypes = {
  MinorParticipantsID: PropTypes.arrayOf(
      PropTypes.string,
  ),
};

export default UpdateMinorParticipantsWidget;
