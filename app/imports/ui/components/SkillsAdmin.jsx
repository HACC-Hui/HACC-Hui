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
class SkillsAdmin extends React.Component {
  render() {
    return (
        <Table.Row>
          <Table.Cell>{this.props.skill.name}</Table.Cell>
          <Table.Cell>{this.props.skill.description}</Table.Cell>
          <Table.Cell>
            <Link to={`/editSkills/${this.props.skill._id}`}>Edit</Link>
          </Table.Cell>
        </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
SkillsAdmin.propTypes = {
  skill: PropTypes.object.isRequired,
};

export default withRouter(SkillsAdmin);
