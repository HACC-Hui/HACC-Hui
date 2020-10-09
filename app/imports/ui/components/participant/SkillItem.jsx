import React from 'react';
import PropTypes from 'prop-types';
import { Item, List } from 'semantic-ui-react';
import { Skills } from '../../../api/skill/SkillCollection';

class SkillItem extends React.Component {
  render() {
    const { item } = this.props;
    const skillName = Skills.findDoc(item.skillID).name;
    return (
        <List.Item>
          <Item>
            <Item.Content>
              <Item.Header>{skillName}</Item.Header>
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
