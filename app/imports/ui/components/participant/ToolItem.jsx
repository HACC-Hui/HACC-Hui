import React from 'react';
import PropTypes from 'prop-types';
import { Item, Label, List } from 'semantic-ui-react';
import { Tools } from '../../../api/tool/ToolCollection';

class ToolItem extends React.Component {
  render() {
    const { item } = this.props;
    const toolName = Tools.findDoc(item.toolID).name;
    const level = item.toolLevel;
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
              <Item.Header>{toolName} <Label color={color}>{level}</Label></Item.Header>
            </Item.Content>
          </Item>
        </List.Item>
    );
  }
}

ToolItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ToolItem;
