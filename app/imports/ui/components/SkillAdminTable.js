import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
class SkillAdminTable extends React.Component {

  render() {
    return (
        <Table.Row>
          <Table.Cell>{this.props.skills.name}</Table.Cell>
          <Table.Cell>{this.props.skills.description}</Table.Cell>
        </Table.Row>
    );
  }
}

/** Require a document to be passed to this component. */
SkillAdminTable.propTypes = {
  skills: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */

export default withRouter(SkillAdminTable);
