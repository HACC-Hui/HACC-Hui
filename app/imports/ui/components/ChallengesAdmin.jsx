import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
/**
 * **Deprecated**
 *
 *  Renders a single row in the List Stuff (Admin) table. See pages/ListStuffAdmin.jsx.
 *  @memberOf ui/components
 */
class ChallengesAdmin extends React.Component {
  render() {
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
