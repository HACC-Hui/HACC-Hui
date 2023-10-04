import React from 'react';
import PropTypes from 'prop-types';
import ListGroup from 'react-bootstrap/ListGroup';

import { Tools } from '../../../api/tool/ToolCollection';

const ToolItem = ({ item }) => {
  const toolName = Tools.findDoc(item.toolID).name;

  return <ListGroup.Item>{toolName}</ListGroup.Item>;
};

ToolItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ToolItem;
