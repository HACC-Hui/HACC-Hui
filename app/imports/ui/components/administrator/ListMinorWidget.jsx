import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
class ListMinorWidget extends React.Component {
  removeItem(docID) {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this participant!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          if (willDelete) {
            removeItMethod.call({
              collectionName: MinorParticipants.getCollectionName(),
              instance: MinorParticipants.getID(participantID),
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Participant removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  }

  render() {
    // const challengeInterestArray = this.findInterests();
    // console.log(challengeInterestArray);
    return (
        <Table.Row>
          <Table.Cell width={2}>{this.props.minorParticipants.username}</Table.Cell>
          <Table.Cell width={5}>{this.props.minorParticipants.parentFirstName}</Table.Cell>
          <Table.Cell width={5}>{this.props.minorParticipants.parentLastName}</Table.Cell>
          <Table.Cell width={5}>{this.props.minorParticipants.parentEmail}</Table.Cell>
          {/* eslint-disable-next-line max-len */}
          <Table.Cell width={2}><Button><Link to={`/edit-challenge/${this.props.challenges._id}`} style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Edit</Link></Button></Table.Cell>
          {/* eslint-disable-next-line max-len */}
          <Table.Cell width={2}><Button negative onClick={() => this.removeItem(this.props.challenges._id)}>Delete</Button></Table.Cell>
        </Table.Row>
    );
  }
}

/** Require a document to be passed to this component. */
ListMinorWidget.propTypes = {
  minorParticipants: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */

export default withTracker(() => (
  {
    minorParticipants: MinorParticipants.find({}).fetch(),
  }
))(ListMinorWidget);
