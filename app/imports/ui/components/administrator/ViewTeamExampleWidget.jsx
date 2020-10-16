import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Grid, Header, List, } from 'semantic-ui-react';
import _ from 'lodash';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

class ViewTeamExampleWidget extends React.Component {
  handleClick(e, inst) {
    console.log(e, inst);
    const collectionName = WantsToJoin.getCollectionName();
    const teamDoc = Teams.findDoc(inst.id);
    const team = Slugs.getNameFromID(teamDoc.slugID);
    const participant = Participants.findDoc({ userID: Meteor.userId() }).username;
    const definitionData = {
      team,
      participant,
    };
    console.log(collectionName, definitionData);
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed to define', error);
      }
    });
  }

  // checkCompliance() {
  //   // const compliantParticipants = _.map(Participants.findDoc({ userID: Meteor.userId() }));
  //   //create a function that maps through all the members of a team
  //   //if all members of the team .isCompliant return: "Team is compliant"
  //   //else return "Team is not compliant"


  render() {
    console.log(this.props.teamMembers);

    // const part = Participants.findDoc({ userID: participantId });

    if(this.props.teamMembers.isCompliant) {
      console.log("compliant");
    } else {
      console.log("not");
    }
    
    return (
          <Grid celled>
          <Grid.Row columns={3}>
            <Grid.Column>
              <Header>{this.props.team.name}</Header>
            </Grid.Column>
            <Grid.Column>
              <List bulleted>
                {this.props.teamMembers.map((t) => <List.Item key={t}>{t}</List.Item>)}
              </List>
            </Grid.Column>
            <Grid.Column>

            </Grid.Column>
          </Grid.Row>
          </Grid>
    );
  }
}

ViewTeamExampleWidget.propTypes = {
  team: PropTypes.object.isRequired,
  teamChallenges: PropTypes.arrayOf(
      PropTypes.string,
  ).isRequired,
  teamSkills: PropTypes.arrayOf(
      PropTypes.string,
  ).isRequired,
  teamTools: PropTypes.arrayOf(
      PropTypes.string,
  ).isRequired,
  teamMembers: PropTypes.arrayOf(
      PropTypes.string,
  ).isRequired,
};

export default ViewTeamExampleWidget;
