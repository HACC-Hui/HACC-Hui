import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Checkbox, Button, Table } from 'semantic-ui-react';
import _ from 'underscore';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import { Participants } from '../../../api/user/ParticipantCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';
import { ROUTES } from '../../../startup/client/route-constants';
import { databaseFileDateFormat } from '../../pages/administrator/DumpDatabase';

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
    return MinorParticipantsList.map((p) => (<Table.Row key={p._id} columns={3}>
      <Table.Cell>{ `${p.firstName} ${p.lastName}`}</Table.Cell>
      <Table.Cell>{p.ParentName}</Table.Cell>
      <Table.Cell><Checkbox value={p._id} onClick={(evt, data) => CheckBoxFun[p._id](evt, data)}/></Table.Cell>
    </Table.Row>));
  }

  download() {
    const minors = this.getMinorParticipants();
    console.log('download', minors);
    let csv = 'Minor Participant Name, Participant email, Parent/Guardian Name (Parent/Guardian email)\n';
    minors.forEach((m) => {
      csv = `${csv}${m.firstName} ${m.lastName},${m.username},${m.ParentName}\n`;
    });
    console.log(csv);
    const zip = new ZipZap();
    const dir = 'hacchui-minor-participants';
    const fileName = `${dir}/${moment().format(databaseFileDateFormat)}-minor-participants.csv`;
    zip.file(fileName, csv);
    zip.saveAs(`${dir}.zip`);

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
            <Button color="green" onClick={() => this.download()}>Download minor participants</Button>
          </div>
          <div style={{
            borderRadius: '1rem',
            backgroundColor: '#E5F0FE',
          }}>
          <Table fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Minor Participant Name</Table.HeaderCell>
                <Table.HeaderCell>Parent Name (Email)</Table.HeaderCell>
                <Table.HeaderCell>Compliant</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.renderMinorParticipants()}</Table.Body>
          </Table>
          <Grid centered >

              <Button type='button' style={{ textAlign: 'center', color: 'white', backgroundColor: '#DB2828',
                margin: '2rem 0rem' }} onClick = {() => this.submitData()}>submit</Button>
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
