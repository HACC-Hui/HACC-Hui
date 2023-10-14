import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Tools } from '../../../api/tool/ToolCollection';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
const ToolsAdminWidget = (props) => {
  const [toolData, setToolData] = useState(props.tools);

  useEffect(() => {
    setToolData(props.tools);
  }, [props.tools]);
  const removeItem = (docID) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this tool!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          if (willDelete) {
            removeItMethod.call({
              collectionName: Tools.getCollectionName(),
              instance: Tools.getID(docID),
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Tool removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  }

    return (
        <tr>
          <th>{toolData.name}</th>
          <th>{toolData.description}</th>
          {/* eslint-disable-next-line max-len */}
          <th width={2}><Button variant="light"><Link to={`/edit-tool/${toolData._id}`} style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Edit</Link></Button></th>
          {/* eslint-disable-next-line max-len */}
          <th width={2}><Button variant="danger" negative onClick={() => removeItem(toolData._id)}>Delete</Button></th>
        </tr>
    );
}

/** Require a document to be passed to this component. */
ToolsAdminWidget.propTypes = {
  tools: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */

export default withRouter(ToolsAdminWidget);
