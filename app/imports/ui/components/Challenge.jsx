import React from 'react';
import { Checkbox, Item, List, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class Challenge extends React.Component {

  state = { checked: false }

  toggle = () => this.setState((prevState) => ({ checked: !prevState.checked }))

  render() {
    return (
        <Item>
          <Item.Content><Popup content={this.props.challenge.description} trigger={
            <p id='choice-style'>{
              <List>
                <List.Item id='radio-style'>
                  <Checkbox label={this.props.challenge.title}/>
                </List.Item>
              </List>
            }</p>
          }/>
            </Item.Content>
        </Item>
    );
  }
}

// Require a document to be passed to this component.
Challenge.propTypes = {
  challenge: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Challenge);
