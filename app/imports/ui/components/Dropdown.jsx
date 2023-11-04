import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ items, onItemSelect, label, style }) => {
  const [show, setShow] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentLabel, setCurrentLabel] = useState(label);

  const toggleDropdown = () => setShow(!show);

  const handleItemClick = (item) => {
    setCurrentLabel(item.text);
    onItemSelect(item.value);
    setShow(false);
  };

  return (
    <div className="dropdown">
      <button className="btn btn-secondary dropdown-toggle" type="button" onClick={toggleDropdown} style={style}>
        {currentLabel}
      </button>
      <ul
        className={`dropdown-menu ${show ? 'show' : ''}`} style={{ ...style, display: show ? 'block' : 'none' }}
      >
        {items.map(item => (
          <li key={item.key}>
            <a
              className="dropdown-item"
              onClick={() => handleItemClick(item)}
              style={{
                ...style,
                backgroundColor: hoveredItem === item.key ? '#e6e6e6' : 'transparent',
                color: hoveredItem === item.key ? 'black' : style.color,
              }}
              onMouseEnter={() => setHoveredItem(item.key)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

Dropdown.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onItemSelect: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  style: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
};

export default Dropdown;
