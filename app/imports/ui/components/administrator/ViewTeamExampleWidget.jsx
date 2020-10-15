import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Header, List } from 'semantic-ui-react';
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

  render() {
    return (
        <Grid container centered>
          <Grid.Column>
            <div style={{
              backgroundColor: '#393B44', padding: '1rem 0rem', margin: '2rem 0rem',
              borderRadius: '2rem',
            }}>
              <Header as="h1" textAlign="center" inverted>View Teams</Header>
            </div>
          <Grid celled>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Header as="h3">Team Name</Header>
            </Grid.Column>
            <Grid.Column>
              <Header as="h3">Members</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Header as="h3">{this.props.team.name}</Header>
            </Grid.Column>
            <Grid.Column>
              <List bulleted>
                {this.props.teamMembers.map((t) => <List.Item key={t}>{t}</List.Item>)}
              </List>
            </Grid.Column>
          </Grid.Row>
          </Grid>
          </Grid.Column>
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
