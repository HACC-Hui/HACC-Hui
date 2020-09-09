import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
class ChallengeAdminTable extends React.Component {

  render() {
    return (
        <Table.Row>
          <Table.Cell>{this.props.challenges.title}</Table.Cell>
          <Table.Cell>{this.props.challenges.description}</Table.Cell>
          <Table.Cell>{this.props.challenges.interests}</Table.Cell>
          <Table.Cell>{this.props.challenges.submissionDetail}</Table.Cell>
          <Table.Cell>{this.props.challenges.pitch}</Table.Cell>
        </Table.Row>
    );
  }
}

/** Require a document to be passed to this component. */
ChallengeAdminTable.propTypes = {
  challenges: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */

export default withRouter(ChallengeAdminTable);
