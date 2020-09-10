import React from 'react';

import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import swal from 'sweetalert';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
import { Skills } from '../../api/skill/SkillCollection';

/**
 * **Deprecated**
 *
 *  Renders a single row in the List Stuff (Admin) table. See pages/ListStuffAdmin.jsx.
 *  @memberOf ui/components
 */
class SkillsAdmin extends React.Component {
  render() {
    function deleteSkill(id) {
      /* eslint-disable-next-line */
      if (confirm('Do you really want to remove this Skill?')) {
        removeItMethod.call({
          collectionName: Skills.getCollectionName(),
          instance: Skills.getID(id) }, (error) => (error ?
            swal('Error', error.message, 'error') :
            swal('Success', 'Challenge updated successfully', 'success')));
      }
    }
    return (
        <Table.Row>
          <Table.Cell>
            {this.props.skill.name}
            <button className="ui button" style ={{margin: 10}}>
              <Link to={`/editSkills/${this.props.skill._id}`}>Edit</Link>
            </button>
            <Button content='Delete' onClick={() => deleteSkill(this.props.skill.slugID)} basic color='red'/>
          </Table.Cell>
          <Table.Cell>{this.props.skill.description}</Table.Cell>
        </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
SkillsAdmin.propTypes = {
  skill: PropTypes.object.isRequired,
};


export default withRouter(SkillsAdmin);
