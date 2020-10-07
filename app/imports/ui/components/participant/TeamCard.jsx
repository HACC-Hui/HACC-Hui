import React from 'react';
import PropTypes from 'prop-types';

class TeamCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return (
        <div>
          {this.props.team.name}
        </div>
    );
  }
}

TeamCard.propTypes = {
  team: PropTypes.object.isRequired,
};

export default TeamCard;
