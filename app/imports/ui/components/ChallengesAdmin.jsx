import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import swal from 'sweetalert';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
import { Challenges } from '../../api/challenge/ChallengeCollection';
/**
 * **Deprecated**
 *
 *  Renders a single row in the List Stuff (Admin) table. See pages/ListStuffAdmin.jsx.
 *  @memberOf ui/components
 */
class ChallengesAdmin extends React.Component {

  render() {
    function deleteChallenge(id) {
      /* eslint-disable-next-line */
      if (confirm('Do you really want to remove this Challenge?')) {
        removeItMethod.call({
          collectionName: Challenges.getCollectionName(),
          instance: Challenges.getID(id) }, (error) => (error ?
            swal('Error', error.message, 'error') :
            swal('Success', 'Challenge updated successfully', 'success')));
      }
    }
    return (
        <Table.Row>
          <Table.Cell>{this.props.challenge.title}</Table.Cell>
          <Table.Cell>{this.props.challenge.description}</Table.Cell>
          <Table.Cell>{this.props.interest}</Table.Cell>
          <Table.Cell>{this.props.challenge.submissionDetail}</Table.Cell>
          <Table.Cell>{this.props.challenge.pitch}</Table.Cell>
          <Table.Cell>
            <Link to={`/editChallenges/${this.props.challenge._id}`}>Edit</Link>
          </Table.Cell>
          <Table.Cell>
            <Button content='Delete' onClick={() => deleteChallenge(this.props.challenge.slugID)} basic color='red'/>
          </Table.Cell>
        </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
ChallengesAdmin.propTypes = {
  challenge: PropTypes.object.isRequired,
  interest: PropTypes.string.isRequired,
};

export default withRouter(ChallengesAdmin);
