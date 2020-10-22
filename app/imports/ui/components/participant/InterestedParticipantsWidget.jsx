import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Item, Divider, Button, Icon, Header, Modal, Grid, List } from 'semantic-ui-react';
import swal from 'sweetalert';
import { Teams } from '../../../api/team/TeamCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
// eslint-disable-next-line import/no-duplicates
import { defineMethod } from '../../../api/base/BaseCollection.methods';
// eslint-disable-next-line import/no-duplicates
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { ToAcceptWantsToJoin } from '../../../api/team/ToAcceptWantToJoinCollection';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
// import { Slugs } from '../../../api/slug/SlugCollection';
// import ListTeamExampleWidget from './ListTeamExampleWidget';
// import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
// import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
// import { Challenges } from '../../../api/challenge/ChallengeCollection';
// import { TeamSkills } from '../../../api/team/TeamSkillCollection';
// import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
// import { Skills } from '../../../api/skill/SkillCollection';
// import { TeamTools } from '../../../api/team/TeamToolCollection';
// import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
// import { Tools } from '../../../api/tool/ToolCollection';
// // import { InterestedParticipants } from '../../../api/team/InterestedParticipantCollection';
// import { ParticipantInterests } from '../../../api/user/ParticipantInterestCollection';
// import { Interests } from '../../../api/interest/InterestCollection';
// import { WantsToJoin } from '../../../api/team/WantToJoinCollection';

// const getParticipantChallenges = (participant) => {
//   const participantID = participant._id;
//   const participantChallengeDocs = ParticipantChallenges.find({ participantID }).fetch();
//   const challengeTitles = participantChallengeDocs.map((dc) => Challenges.findDoc(dc.challengeID).title);
//   return challengeTitles;
// };

// const getParticipantSkills = (participant) => {
//   const participantID = participant._id;
//   const participantSkills = ParticipantSkills.find({ participantID }).fetch();
//   const skillNames = participantSkills.map((ds) => Skills.findDoc(ds.skillID).name);
//   return skillNames;
// };

// const getParticipantTools = (participant) => {
//   const participantID = participant._id;
//   const participantTools = ParticipantTools.find({ participantID }).fetch();
//   const toolNames = participantTools.map((dt) => Tools.findDoc(dt.toolID).name);
//   return toolNames;
// };

// const getParticipantInterests = (participant) => {
//   const participantID = participant._id;
//   const participantInterests = ParticipantInterests.find({ participantID }).fetch();
//   const interestNames = participantInterests.map((di) => Interests.findDoc(di.interestID).name);
//   return interestNames;
// };

// const getParticipantTeams = (participant) => {
//   const participantID = participant._id;
//   const participantTeams = TeamParticipants.find({ participantID }).fetch();
//   const usersTeams = participantTeams.map((dt) => Teams.findDoc(dt.teamID));
//   return usersTeams;
// };

// const getTeammates = (team, participant) => {
//   const teamID = team._id;
//   const teamsParticipants = TeamParticipants.find({ teamID }).fetch();
//   const teammates = teamsParticipants.map((td) => (
//     td.participantID !== participant._id ? Participants.findDoc(td.participantID) : ''
//   ));
//   return teammates;
// };

// const getInterestedParticipants = (team) => {
//   const teamID = team._id;
//   const InterestedParticipants = WantsToJoin.find({ teamID }).fetch();
//   const interestedParticipants = InterestedParticipants.map((wd) => Participants.findDoc(wd.participantID));
//   return interestedParticipants;
// };

class InterestedParticipantsWidget extends React.Component {
  state = {};

  accept = (e, inst) => {
    console.log('inst: ', inst.id);
    let collectionName = TeamParticipants.getCollectionName();
    const participant = Participants.findDoc(inst.id);
    const team = this.props.team;
    const interested = ToAcceptWantsToJoin.findDoc({ participantID: inst.id });
    const definitionData = {
      team,
      participant,
    };
    console.log(collectionName, definitionData);
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
        // console.error(error.message);
      } else {
        swal('Success', 'Participant successfully added to team', 'success');
        // console.log(result);
      }
    });
    collectionName = ToAcceptWantsToJoin.getCollectionName();
    const instance = interested._id;
    removeItMethod.call({ collectionName, instance });
  }

  decline = (e, inst) => {
    const collectionName = ToAcceptWantsToJoin.getCollectionName();
    const interested = ToAcceptWantsToJoin.findDoc({ participantID: inst.id });
    const instance = interested._id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
        // console.error(error.message);
      } else {
        swal('Success', 'Successfully declined request', 'success');
        // console.log(result);
      }
    });
  }

  render() {
    const { value } = this.state;

    function changeBackground(e) {
      e.currentTarget.style.backgroundColor = '#fafafa';
      e.currentTarget.style.cursor = 'pointer';
    }

    function onLeave(e) {
      e.currentTarget.style.backgroundColor = 'transparent';
    }

    function setOptions() {
      const teams = Teams.find({ owner: Participants.findDoc({ userID: Meteor.userId() })._id }).fetch();
      const newOptions = [];
      newOptions.push({ key: 'Select a Team', text: 'Select a Team', value: 'Select a Team' });
      for (let i = 0; i < teams.length; i++) {
        newOptions.push({ key: teams[i].name, text: teams[i].name, value: teams[i].name });
      }
      // console.log(newOptions);
      return newOptions;
    }

    // const options = setOptions();

    return (
      <div>
        <Item onMouseEnter={changeBackground} onMouseLeave={onLeave}
              style={{ padding: '0rem 1.5rem 1.5rem 1.5rem' }}>
          <Modal closeIcon trigger={
            <Item.Content>
              <Item.Header>
                <Header as={'h3'} style={{ color: '#263763' }}>
                  <Icon name='user' size='tiny' />
                  {console.log('participant.firstname: ', this.props.participant.firstName)}
                  {this.props.participant.firstName} {this.props.participant.lastName}
                </Header>
              </Item.Header>
                <Item.Description>
                    <Grid.Column>
                      <Header>About Me</Header>
                      {this.props.participant.aboutMe}
                    </Grid.Column>
                    <Divider hidden/>
                      <Grid doubling stackable columns={5}>
                        <Grid.Column>
                          <Header>Challenges</Header>
                          <Grid.Column floated={'left'} style={{ paddingBottom: '0.3rem' }}>
                            {this.props.challenges.slice(0, 3).map((challenge, i) => <p
                                style={{ color: 'rgb(89, 119, 199)' }}
                                key={challenge + i}>
                              {challenge}</p>)}
                          </Grid.Column>
                        </Grid.Column>
                        <Grid.Column>
                          <Header>Skills</Header>
                          {this.props.skills.slice(0, 3).map((skill, i) => <p key={skill + i}>
                            {skill.name}</p>)}
                        </Grid.Column>
                        <Grid.Column>
                          <Header>Tools</Header>
                          {this.props.tools.slice(0, 3).map((tool, i) => <p key={tool + i}>
                            {tool.name}</p>)}
                        </Grid.Column>
                        <Grid.Column>
                          <Header>Interests</Header>
                          {this.props.participant.interest}
                        </Grid.Column>
                        <Grid.Column>
                          <Header>Slack Username</Header>
                          {this.props.participant.username}
                        </Grid.Column>
                        {/* <Grid.Column floated='right'>
                          <Button.Group style={{float:'right'}}>
                            <Button positive>Accept</Button>
                            <Button.Or />
                            <Button negative>Decline</Button>
                          </Button.Group>
                        </Grid.Column> */}
                      </Grid>
                      {/* <Grid stackable columns={2}>
                        <Grid.Column>
                          <Header>Slack Username</Header>
                          {this.props.participants.username}
                        </Grid.Column>
                        <Grid.Column textAlign='right'>
                          <Button.Group>
                              <Button onClick={this.accept} positive>Accept</Button>
                              <Button.Or />
                              <Button onClick={this.decline} negative>Decline</Button>
                            </Button.Group>
                        </Grid.Column>
                      </Grid> */}
              </Item.Description>
              {/* <Button.Group style={{float:'right'}}>
                <Button positive>Accept</Button>
                <Button.Or />
                <Button negative>Decline</Button>
              </Button.Group> */}
            </Item.Content>
          }>
            {/* eslint-disable-next-line max-len */}
            <Modal.Header>{this.props.participant.firstName} {this.props.participant.lastName} <br /> {this.props.participant.demographicLevel}</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <Grid container columns={2}>
                  <Grid.Column><Icon name="github"/>GitHub:<br/>
                    <a href={this.props.participant.gitHub}>{this.props.participant.gitHub}</a>
                  </Grid.Column>
                  <Grid.Column><Icon name="server"/>Website:<br/>
                    <a href={this.props.participant.website}>{this.props.participant.website}</a>
                  </Grid.Column>
                  <Grid.Column><Icon name="linkedin"/>LinkedIn:<br/>
                    <a href={this.props.participant.linkedIn}>{this.props.participant.linkedIn}</a>
                  </Grid.Column>
                  <Grid.Column><Icon name="slack"/>Slack Username:<br/>
                    <a href={this.props.participant.username}>{this.props.participant.username}</a>
                  </Grid.Column>
                </Grid>
                <Divider hidden/>
                <Grid.Column>
                  <Header dividing size="small">Challenges</Header>
                  <List bulleted>
                    {this.props.challenges.map((challenge) => <List.Item key={challenge}>{challenge}</List.Item>)}
                  </List>
                </Grid.Column>
                <Divider hidden/>
                <Grid.Column>
                  <Header dividing size="small">Skills</Header>
                  <List bulleted>
                    {this.props.skills.map((skill) => <List.Item key={skill}>{skill.name}</List.Item>)}
                  </List>
                </Grid.Column>
                <Divider hidden/>
                <Grid.Column>
                  <Header dividing size="small">Tools</Header>
                  <List bulleted>
                    {this.props.tools.map((tool) => <List.Item key={tool}>{tool.name}</List.Item>)}
                  </List>
                </Grid.Column>
                <Divider hidden/>
                <Grid.Column>
                  <Header dividing size="small">Interests</Header>
                  <List bulleted>
                    {this.props.interests.map((interest) => <List.Item key={interest}>{interest.name}</List.Item>)}
                  </List>
                </Grid.Column>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button.Group>
                <Button id={this.props.parID} onClick={this.accept} positive>Accept</Button>
                <Button.Or />
                <Button id={this.props.parID} onClick={this.decline} negative>Decline</Button>
              </Button.Group>
            </Modal.Actions>
          </Modal>
        </Item>
        <Button.Group attached='bottom'>
          <Button id={this.props.parID} onClick={this.accept} positive>Accept</Button>
          <Button.Or />
          <Button id={this.props.parID} onClick={this.decline} negative>Decline</Button>
        </Button.Group>
        <Divider></Divider>
      </div>
    );
  }
}

InterestedParticipantsWidget.propTypes = {
  parID: PropTypes.string.isRequired,
  participant: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  interests: PropTypes.array.isRequired,
};

export default withTracker(() => {})(InterestedParticipantsWidget);
