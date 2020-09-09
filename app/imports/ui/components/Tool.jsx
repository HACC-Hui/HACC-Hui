import React from 'react';
import { Item, Menu, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { skillAndToolLevels } from '../../api/level/Levels';

class Tool extends React.Component {

  state = { }

  handleToolClick = (e, { name }) => this.setState({ activeTool: name })

  render() {
    const { activeTool } = this.state;

    return (
        <Item>
          <Item.Content><Popup content={this.props.tool.description} trigger={
            <p id='choice-style'>{this.props.tool.name}</p>
          }/>
            <Menu secondary pointing fluid widths={3}>
              {skillAndToolLevels.map((c) => (
                  // eslint-disable-next-line react/jsx-key
                  <Menu.Item
                      name={c}
                      active={activeTool === c}
                      onClick={this.handleToolClick}
                  />
              ))}
            </Menu></Item.Content>
        </Item>
    );
  }
}

// Require a document to be passed to this component.
Tool.propTypes = {
  tool: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Tool);
