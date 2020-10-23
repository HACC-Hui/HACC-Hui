import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, List, Button } from 'semantic-ui-react';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

class ViewTeamExampleWidget extends React.Component {
  handleClick(e, inst) {
    console.log(e, inst);
    const collectionName = WantsToJoin.getCollectionName();
    const teamDoc = Teams.findDoc(inst.id);
    const team = Slugs.getNameFromID(teamDoc.slugID);
    const definitionData = {
      team,
    };
    console.log(collectionName, definitionData);
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed to define', error);
      }
    });
  }

  render() {
    const allParticipants = this.props.participants;
    function getTeamParticipants(teamID, teamParticipants) {
      const data = [];
      const participants = _.filter(teamParticipants, { teamID: teamID });
      for (let i = 0; i < participants.length; i++) {
        for (let j = 0; j < allParticipants.length; j++) {
          if (participants[i].participantID === allParticipants[j]._id) {
            data.push({
              compliant: allParticipants[j].isCompliant,
            });
          }
        }
      }
      return data;
    }

    return (
        <Grid celled>
          <Grid.Row columns={4}>
            <Grid.Column>
              <Header>{this.props.team.name}</Header>
            </Grid.Column>
            <Grid.Column>
              <List bulleted>
                {this.props.teamMembers.map((t) => <List.Item key={t}>{t}</List.Item>)}
              </List>
            </Grid.Column>
            <Grid.Column>
              { (_.every(getTeamParticipants(this.props.team._id, this.props.teamParticipants),
                  function (value) { return (value.compliant !== false); }))
                  ? <Header>Team is Compliant</Header> : <Header><mark>Team is not Compliant</mark></Header> }
            </Grid.Column>
            <Grid.Column>
              {/* eslint-disable-next-line max-len */}
              <Button><Link to={`/admin-edit-team/${this.props.team._id}`} style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Edit</Link></Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
    );
  }
}

ViewTeamExampleWidget.propTypes = {
  team: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired,
  teamParticipants: PropTypes.arrayOf(PropTypes.object).isRequired,
  teamMembers: PropTypes.arrayOf(
      PropTypes.string,
  ).isRequired,
  // teamCompliance: PropTypes.arrayOf(
  //     PropTypes.boolean,
  // ).isRequired,
};

export default withTracker(() => ({
  participants: Participants.find({}).fetch(),
  teamParticipants: TeamParticipants.find({}).fetch(),
}))(ViewTeamExampleWidget);
