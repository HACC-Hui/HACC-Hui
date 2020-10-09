import React from 'react';
import PropTypes from 'prop-types';
import { Item, List } from 'semantic-ui-react';
import { Tools } from '../../../api/tool/ToolCollection';

class ToolItem extends React.Component {
  render() {
    const { item } = this.props;
    const toolName = Tools.findDoc(item.toolID).name;
    return (
        <List.Item>
          <Item>
            <Item.Content>
              <Item.Header>{toolName}</Item.Header>
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
