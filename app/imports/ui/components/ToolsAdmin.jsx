
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
class ToolsAdmin extends React.Component {
  render() {
    return (
        <Table.Row>
          <Table.Cell>
            {this.props.tool.name}
            <button className="ui button" style ={{margin: 10}}>
              <Link to={`/editTools/${this.props.tool._id}`}>Edit</Link>
            </button>
          </Table.Cell>
          <Table.Cell>{this.props.tool.description}</Table.Cell>
        </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
ToolsAdmin.propTypes = {
  tool: PropTypes.object.isRequired,
};

export default withRouter(ToolsAdmin);