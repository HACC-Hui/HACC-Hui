import React from 'react';
import PropTypes from 'prop-types';
import ListGroup from 'react-bootstrap/ListGroup';

import { Skills } from '../../../api/skill/SkillCollection';

const SkillItem = ({ item }) => {
  const skillName = Skills.findDoc(item.skillID).name;

  return <ListGroup.Item>{skillName}</ListGroup.Item>;
};

SkillItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default SkillItem;
