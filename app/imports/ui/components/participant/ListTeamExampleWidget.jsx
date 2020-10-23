import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Header, List } from 'semantic-ui-react';
import _ from 'lodash';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { ToAcceptWantsToJoin } from '../../../api/team/ToAcceptWantToJoinCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

class ListTeamExampleWidget extends React.Component {
  constructor(props) {
    super(props);

    const participant = Participants.findDoc({ userID: Meteor.userId() });
    this.state = { 
      requestedToJoin: ToAcceptWantsToJoin.isDefined({ teamID: this.props.team._id, participantID: participant._id })
    };
  }

  handleClick(e, inst) {
    console.log(e, inst);
    let collectionName = WantsToJoin.getCollectionName();
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
        this.setState({ requestedToJoin: false });
        swal('Error', error.message, 'error');
        // console.error(error.message);
      } else {
        // console.log(`Adding to WantToJoin`)
        this.setState({ requestedToJoin: true });
        swal('Success', 'Successfully requested to join WantsToJoin', 'success');
        // console.log(result);
      }
    });
    collectionName = ToAcceptWantsToJoin.getCollectionName();
    console.log('ToAcceptWantsToJoin: ', collectionName, definitionData);
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        this.setState({ requestedToJoin: false });        
        swal('Error', error.message, 'error');
      } else {
        // console.log(`Adding to ToAcceptWantToJoin`)
        this.setState({ requestedToJoin: true });        
        swal('Success', 'Successfully requested to join toAcceptWantsToJoin', 'success');
        // console.log(result);
      }
    });
  }

  render() {
    const participant = Participants.findDoc({ userID: Meteor.userId() });
    const participantName = Participants.getFullName(participant._id);
    const isAMember = _.includes(this.props.teamMembers, participantName);

    return (
        <Grid.Row columns={6}>
          <Grid.Column>
            <Header as="h3">{this.props.team.name}</Header>
          </Grid.Column>
          <Grid.Column>
            <List bulleted>
              {this.props.teamChallenges.map((c) => <List.Item key={c}>{c}</List.Item>)}
            </List>
          </Grid.Column>
          <Grid.Column>
            <List bulleted>
              {this.props.teamSkills.map((s) => <List.Item key={s}>{s}</List.Item>)}
            </List>
          </Grid.Column>
          <Grid.Column>
            <List bulleted>
              {this.props.teamTools.map((t) => <List.Item key={t}>{t}</List.Item>)}
            </List>
          </Grid.Column>
          <Grid.Column>
            <List bulleted>
              {this.props.teamMembers.map((t) => <List.Item key={t}>{t}</List.Item>)}
            </List>
          </Grid.Column>
          <Grid.Column>
            {isAMember ? '' : (
              <Button id={this.props.team._id} color="green"
                      onClick={this.handleClick.bind(this)} disabled={this.state.requestedToJoin}>Request to Join</Button>
            )}
          </Grid.Column>
        </Grid.Row>
    );
  }
}

ListTeamExampleWidget.propTypes = {
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

export default ListTeamExampleWidget;
