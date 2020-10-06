import { Meteor } from 'meteor/meteor';
import React from 'react';
import {
  Grid,
  Header,
  Loader,
  Item,
  Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'lodash';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import YourTeamsCard from './YourTeamsCard';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class YourTeamsWidget extends React.Component {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {

    const allParticipants = this.props.participants;
    function getTeamParticipants(teamID, teamParticipants) {
      const data = [];
      const participants = _.filter(teamParticipants, { teamID: teamID });
      for (let i = 0; i < participants.length; i++) {
        for (let j = 0; j < allParticipants.length; j++) {
          if (participants[i].participantID === allParticipants[j]._id) {
            data.push({
              firstName: allParticipants[j].firstName,
              lastName: allParticipants[j].lastName,
            });
          }
        }
      }
      return data;
    }

    console.log(this.props.teamInvitation)
    if (this.props.teams.length === 0) {
      return (
          <div align={'center'}>
            <Header as='h2' icon>
              <Icon name='users'/>
              You are not the owner of any teams
              <Header.Subheader>
                Please check back later.
              </Header.Subheader>
            </Header>
          </div>
      );
    }

    return (
        <Grid container doubling relaxed stackable>
          <Grid.Row centered>
            <Header as={'h2'} style={{ paddingTop: '2rem' }}>
              Your Teams
            </Header>
          </Grid.Row>
          <Grid.Column width={15}>
            <Item.Group divided>
              {/* eslint-disable-next-line max-len */}
              {this.props.teams.map((teams) => <YourTeamsCard key={teams._id} teams={teams} teamParticipants={getTeamParticipants(teams._id, this.props.teamParticipants)} teamInvitation={this.props.teamInvitation}/>)}
            </Item.Group>
          </Grid.Column>
        </Grid>
    );
  }
}

YourTeamsWidget.propTypes = {
  teams: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  teamParticipants: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  teamInvitation: PropTypes.array.isRequired,

};

export default withTracker(() => {
  const subscriptionDevelopers = Participants.subscribe();
  const subscriptionTeam = Teams.subscribe();
  const teamDev = TeamParticipants.subscribe();
  const intivationSub = TeamInvitations.subscribe();

  return {
    teams: Teams.find({ owner: Participants.findDoc({ userID: Meteor.userId() })._id }).fetch(),
    participants: Participants.find({}).fetch(),
    teamParticipants: TeamParticipants.find({}).fetch(),
    teamInvitation: TeamInvitations.find({}).fetch(),
    // eslint-disable-next-line max-len
    ready: subscriptionDevelopers.ready() && subscriptionTeam.ready() && teamDev.ready() && intivationSub.ready(),
  };
})(YourTeamsWidget);
