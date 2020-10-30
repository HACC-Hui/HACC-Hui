import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Header, List } from 'semantic-ui-react';
// import _ from 'lodash';
import _ from 'underscore';
import swal from 'sweetalert';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

class ListTeamExampleWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sent: false };
    this.handleClick = this.handleClick.bind(this);
  }

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
        swal('Sent Request Fail', error, 'error');
      } else {

        swal('Success', 'Join Request Sent', 'success');
        this.setState({ sent: true });
}
    });
  }

  renderButton() {
    const participant = Participants.findDoc({ userID: Meteor.userId() });
    const participantName = Participants.getFullName(participant._id);
    const isAMember = _.includes(this.props.teamMembers, participantName);

    const Joinrequests = WantsToJoin.find({ teamID: this.props.team._id }).fetch();
    const Joinsentusers = _.pluck(Joinrequests, 'participantID');
    const Requested = _.contains(Joinsentusers, participant._id);

    if (isAMember) {
      return (<Button id={this.props.team._id} color="green"
                      disabled={true} style={{ width: `${100}px`,
        height: `${50}px`, textAlign: 'center' }} >You own the team</Button>);
    }
    if (this.state.sent || Requested) {
      return (<Button id={this.props.team._id} color="green"
                      disabled={true} style={{ width: `${100}px`,
        height: `${50}px`, textAlign: 'center' }} >You sent the request</Button>);
    }
    return (<Button id={this.props.team._id} color="green"
                    onClick={this.handleClick} style={{ width: `${100}px`,
      height: `${50}px`, textAlign: 'center' }} >Request to Join</Button>);
  }

  render() {

    return (
        <Grid.Row columns={7} >
          <Grid.Column>
            <Header as="h3">{this.props.team.name}</Header>
          </Grid.Column>
          <Grid.Column only='computer'>
            <List bulleted>
              {this.props.teamChallenges.map((c) => <List.Item key={c}>{c}</List.Item>)}
            </List>
          </Grid.Column>
          <Grid.Column only='tablet mobile'>
            <Header>Challenges</Header>
            <List bulleted>
              {this.props.teamChallenges.map((c) => <List.Item key={c}>{c}</List.Item>)}
            </List>
          </Grid.Column>
          <Grid.Column only='computer'>
            <List bulleted>
              {this.props.teamSkills.map((s) => <List.Item key={s}>{s}</List.Item>)}
            </List>
          </Grid.Column>
          <Grid.Column only='tablet mobile'>
            <Header>Desired Skills</Header>
            <List bulleted>
              {this.props.teamSkills.map((s) => <List.Item key={s}>{s}</List.Item>)}
            </List>
          </Grid.Column>
          <Grid.Column only='computer'>
            <List bulleted>
              {this.props.teamTools.map((t) => <List.Item key={t}>{t}</List.Item>)}
            </List>
          </Grid.Column>
          <Grid.Column only='tablet mobile'>
            <Header>Desired Tools</Header>
            <List bulleted>
              {this.props.teamTools.map((t) => <List.Item key={t}>{t}</List.Item>)}
            </List>
          </Grid.Column>
          <Grid.Column>
            <a href={this.props.team.devPostPage}>Devpost Page</a> <br />
            <a href={this.props.team.gitHubRepo}>GitHub repo</a>
          </Grid.Column>
          <Grid.Column only='computer'>
            <List bulleted>
              {this.props.teamMembers.map((t) => <List.Item key={t}>{t}</List.Item>)}
            </List>
          </Grid.Column>
          <Grid.Column only='tablet mobile'>
            <Header>Team Members</Header>
            <List bulleted>
              {this.props.teamMembers.map((t) => <List.Item key={t}>{t}</List.Item>)}
            </List>
          </Grid.Column>
          <Grid.Column textAlign='center'>
            {this.renderButton()}
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
