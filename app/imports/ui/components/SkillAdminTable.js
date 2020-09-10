import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
class SkillAdminTable extends React.Component {

  render() {
    return (
        <Table.Row>
          <Table.Cell>{this.props.skills.name}</Table.Cell>
          <Table.Cell>{this.props.skills.description}</Table.Cell>
          {/* eslint-disable-next-line max-len */}
          <Table.Cell width={2}><Button><Link to={`/edit-skill/${this.props.skills._id}`} style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Edit</Link></Button></Table.Cell>
          <Table.Cell width={2}><Button negative>Delete</Button></Table.Cell>
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
