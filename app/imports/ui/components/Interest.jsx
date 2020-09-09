import React from 'react';
import { Popup, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class Interest extends React.Component {

  render() {
    return (
          <Popup content={this.props.interest.description} trigger={
            <Label color='teal'>{this.props.interest.name}</Label>
          }/>
    );
  }
}

// Require a document to be passed to this component.
Interest.propTypes = {
  interest: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Interest);
