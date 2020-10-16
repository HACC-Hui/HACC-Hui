import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import TeamCard from './TeamCard';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';

class TeamMembershipWidget extends React.Component {
  render() {
    return (
        <React.Fragment>
          {this.props.teams.map((team) => <TeamCard team={team}
                                                    key={team._id} participantID={this.props.participantID}/>)}
        </React.Fragment>
    );
  }
}

TeamMembershipWidget.propTypes = {
  teams: PropTypes.arrayOf(
      PropTypes.object,
  ),
  participantID: PropTypes.string,
};

export default withTracker(() => {
  const participantID = Participants.findDoc({ userID: Meteor.userId() })._id;
  const teamParts = TeamParticipants.find({ participantID }).fetch();
  const teams = _.map(teamParts, (tP) => Teams.findDoc(tP.teamID));
  return {
    teams,
    participantID,
  };
})(TeamMembershipWidget);
