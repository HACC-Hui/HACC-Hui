import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Grid, Header } from 'semantic-ui-react';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

class ListTeamExampleWidget extends React.Component {
  handleClick(e, inst) {
    console.log(e, inst);
    const collectionName = WantsToJoin.getCollectionName();
    const teamDoc = Teams.findDoc(inst.id);
    const team = Slugs.getNameFromID(teamDoc.slugID);
    const developer = Developers.findDoc({ userID: Meteor.userId() }).username;
    const definitionData = {
      team,
      developer,
    };
    console.log(collectionName, definitionData);
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed to define', error);
      }
    });
  }

  handleClick2 = () => {
    const id = this.props.team._id;
    removeItMethod.call({ collectionName: Teams.getCollectionName(), instance: id });
  }

  render() {
    const developer = Developers.findDoc({ userID: Meteor.userId() });
    return (
        <Grid.Row columns={5}>
          <Grid.Column>
            <Header as="h3">{this.props.team.name}</Header>
            {this.props.team.owner === Developers.findDoc({ userID: Meteor.userId() })._id ?
            <Link className='edit' to={`/update-team/${this.props.team._id}`}>Edit</Link>
            : '' }
          </Grid.Column>
          <Grid.Column>
            <Header as="h3">{this.props.teamChallenges.join(',')}</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h3">{this.props.teamSkills.join(',')}</Header>
          </Grid.Column>
          <Grid.Column>
            <Header as="h3">{this.props.teamTools.join(',')}</Header>
          </Grid.Column>
          <Grid.Column>
            <Button id={this.props.team._id} color="green" onClick={this.handleClick}>Request to Join</Button>
            { (this.props.team.owner === developer._id) ? <Button
                color="red"
                id={this.props.team._id}
                content='Delete Team'
                onClick={this.handleClick2}>
            </Button> : '' }
          </Grid.Column>
        </Grid.Row>
    );
  }
}

ListTeamExampleWidget.propTypes = {
  team: PropTypes.object,
  teamChallenges: PropTypes.arrayOf(
      PropTypes.string,
  ),
  teamSkills: PropTypes.arrayOf(
      PropTypes.string,
  ),
  teamTools: PropTypes.arrayOf(
      PropTypes.string,
  ),
};

export default ListTeamExampleWidget;
