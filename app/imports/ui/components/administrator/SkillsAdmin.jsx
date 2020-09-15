import React from 'react';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * **Deprecated**
 *
 *  Renders a single row in the List Stuff (Admin) table. See pages/ListStuffAdmin.jsx.
 *  @memberOf ui/components
 */
class SkillsAdmin extends React.Component {
  render() {
    return (
        <Table.Row>
          <Table.Cell>{this.props.skills.name}</Table.Cell>
          <Table.Cell>{this.props.skills.description}</Table.Cell>
        </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
SkillsAdmin.propTypes = {
  skills: PropTypes.object.isRequired,
};

export default withRouter(SkillsAdmin);
