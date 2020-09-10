import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import swal from 'sweetalert';
import { Tools } from '../../api/tool/ToolCollection';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
import { Challenges } from '../../api/challenge/ChallengeCollection';

/**
 * **Deprecated**
 *
 *  Renders a single row in the List Stuff (Admin) table. See pages/ListStuffAdmin.jsx.
 *  @memberOf ui/components
 */
class ToolsAdmin extends React.Component {
  render() {
    function deleteTool(id) {
      /* eslint-disable-next-line */
      if (confirm('Do you really want to remove this Challenge?')) {
        removeItMethod.call({
          collectionName: Tools.getCollectionName(),
          instance: Tools.getID(id) }, (error) => (error ?
            swal('Error', error.message, 'error') :
            swal('Success', 'Challenge updated successfully', 'success')));
      }
    }
    return (
        <Table.Row>
          <Table.Cell>
            {this.props.tool.name}
            <button className="ui button" style ={{margin: 10}}>
              <Link to={`/editTools/${this.props.tool._id}`}>Edit</Link>
            </button>
            <Button content='Delete' onClick={() => deleteTool(this.props.tool.slugID)} basic color='red'/>
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
