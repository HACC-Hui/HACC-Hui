import React from 'react';
import { Item, Menu, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { skillAndToolLevels } from '../../api/level/Levels';

class Skill extends React.Component {

  state = { }

  handleSkillClick = (e, { name }) => this.setState({ activeSkill: name })

  render() {
    const { activeSkill } = this.state;

    return (
        <Item>
          <Item.Content><Popup content={this.props.skill.description} trigger={
            <p id='choice-style'>{this.props.skill.name}</p>
          }/>
            <Menu secondary pointing fluid widths={3}>
              {skillAndToolLevels.map((c, index) => (
                  // eslint-disable-next-line react/jsx-key
                  <Menu.Item
                      key={index}
                      name={c}
                      active={activeSkill === c}
                      onClick={this.handleSkillClick}
                  />
              ))}
            </Menu></Item.Content>
        </Item>
    );
  }
}

// Require a document to be passed to this component.
Skill.propTypes = {
  skill: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Skill);
