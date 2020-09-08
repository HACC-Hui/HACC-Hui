import React from 'react';
import { Button } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
/**
 * **Deprecated**
 *
 *  Renders a single row in the List Stuff (Admin) table. See pages/ListStuffAdmin.jsx.
 *  @memberOf ui/components
 */
class AddSkillButton extends React.Component {
  render() {
    return (
        <Link to={'/addSkill/'}>
          <Button>
            Add
          </Button>
        </Link>
    );
  }
}

export default withRouter(AddSkillButton);
