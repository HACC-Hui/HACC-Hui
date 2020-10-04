import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Skills } from '../../../api/skill/SkillCollection';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
class SkillsAdminWidget extends React.Component {
  removeItem(docID) {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this skill!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          if (willDelete) {
            removeItMethod.call({
              collectionName: Skills.getCollectionName(),
              instance: Skills.getID(docID),
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Skill removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  }

  render() {
    return (
        <Table.Row>
          <Table.Cell>{this.props.skills.name}</Table.Cell>
          <Table.Cell>{this.props.skills.description}</Table.Cell>
          {/* eslint-disable-next-line max-len */}
          <Table.Cell width={2}><Button><Link to={`/edit-skill/${this.props.skills._id}`} style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Edit</Link></Button></Table.Cell>
          {/* eslint-disable-next-line max-len */}
          <Table.Cell width={2}><Button negative onClick={() => this.removeItem(this.props.skills._id)}>Delete</Button></Table.Cell>
        </Table.Row>
    );
  }
}

/** Require a document to be passed to this component. */
SkillsAdminWidget.propTypes = {
  skills: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */

export default withRouter(SkillsAdminWidget);
