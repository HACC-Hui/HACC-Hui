import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/**
 * **Deprecated**
 *
 *  Renders a single row in the List Stuff (Admin) table. See pages/ListStuffAdmin.jsx.
 *  @memberOf ui/components
 */
class ToolsAdmin extends React.Component {
  render() {
    return (
        <Table.Row>
          <Table.Cell>{this.props.tool.name}</Table.Cell>
          <Table.Cell>{this.props.tool.description}</Table.Cell>
        </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
ToolsAdmin.propTypes = {
  tool: PropTypes.object.isRequired,
};

export default ToolsAdmin;
