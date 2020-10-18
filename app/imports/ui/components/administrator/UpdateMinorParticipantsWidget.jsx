import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Checkbox, Button } from 'semantic-ui-react';
import _ from 'underscore';
import swal from 'sweetalert';
import Redirect from 'react-router/modules/Redirect';
import { Participants } from '../../../api/user/ParticipantCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

class UpdateMinorParticipantsWidget extends React.Component {

  compliantMinors;

  constructor(props) {
    super(props);
    this.compliantMinors = [];
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

  initMP() {
    const initCompliantMinorParticipants = [];
    const initCompliantMinorParticipant = {};
    this.props.MinorParticipantsID.each((MinorParticipant) => {
 initCompliantMinorParticipant._id = MinorParticipant;
      initCompliantMinorParticipant.isCompliant = false;
      initCompliantMinorParticipants.push(initCompliantMinorParticipant);
    });
    this.compliantMinors = initCompliantMinorParticipants;
  }

  renderMinorParticipants() {
    this.initMP();
    const onChangeCheckbox = (evt, data) => {
      const compliantMinorscopy = this.compliantMinors;
      // eslint-disable-next-line eqeqeq
      const Index = compliantMinorscopy.findIndex(p => p._id == data.value);
      compliantMinorscopy[Index].isCompliant = data.checked;
      this.compliantMinors = compliantMinorscopy;
    };
    const MinorParticipants = this.getMinorParticipants();
    return MinorParticipants.map((p) => (<Grid.Row key={p._id} columns={3}>
      <Grid.Column>p.firstName</Grid.Column>
      <Grid.Column>p.lastName</Grid.Column>
      <Checkbox value={p._id} onClick={(evt, data) => onChangeCheckbox(evt, data)} />
    </Grid.Row>));
  }

  submitData() {
    let Error = false;
    let isCompliantMP = this.compliantMinors;
    // eslint-disable-next-line eqeqeq
    isCompliantMP = isCompliantMP.filter((MP) => MP.isCompliant == true);
    isCompliantMP.each((MP => {
      const collectionName = Participants.getCollectionName();
      const updateData = {
        id: MP._id,
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
     // return <Redirect to={ { pathname: '/' }}/>;
    } else swal('Fail', 'updated fail', 'error');

  }

  render() {
    return (
        <div>
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
            <Button style={{ textAlign: 'center' }} onClick = {this.submitData()}>submit</Button>
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
