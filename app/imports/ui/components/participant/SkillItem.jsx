import React from 'react';
import PropTypes from 'prop-types';
import { Item, Label, List } from 'semantic-ui-react';
import { Skills } from '../../../api/skill/SkillCollection';

class SkillItem extends React.Component {
  render() {
    const { item } = this.props;
    const skillName = Skills.findDoc(item.skillID).name;
    const level = item.skillLevel;
    let color = 'blue';
    if (level && level.startsWith('D')) {
      color = 'yellow';
    }
    if (level && level.startsWith('N')) {
      color = 'olive';
    }
    return (
        <List.Item>
          <Item>
            <Item.Content>
              <Item.Header>{skillName} <Label color={color}>{level}</Label></Item.Header>
            </Item.Content>
          </Item>
        </List.Item>
    );
  }
}

SkillItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default SkillItem;
