import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

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
          <Table.Cell>{this.props.challenge.interests}</Table.Cell>
          <Table.Cell>{this.props.challenge.submissionDetail}</Table.Cell>
          <Table.Cell>{this.props.challenge.pitch}</Table.Cell>
        </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
ChallengesAdmin.propTypes = {
  challenge: PropTypes.object.isRequired,
};

export default ChallengesAdmin;
