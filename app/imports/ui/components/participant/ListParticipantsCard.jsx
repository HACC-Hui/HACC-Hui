import React from 'react';
import { Meteor } from 'meteor/meteor';
import {
  Grid,
  Header,
  Item,
  Modal,
  Icon,
  Button,
  Dropdown,
  List, Divider,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';

class ListParticipantsCard extends React.Component {
  /*
  isAdded(tID, dID) {
    // console.log(typeof TeamDevelopers.findOne({ teamID: tID, developerID: dID }) !== 'undefined');
    if (typeof TeamDevelopers.findOne({ teamID: tID, developerID: dID }) !== 'undefined') {
      return true;
    }
    return false;
  }
   */

  state = {};

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
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
      console.log(newOptions);
      return newOptions;
    }

    const options = setOptions();

    function handleChange(dID, { value }, e) {
      console.log(e);
      console.log(e.value);
      console.log(dID);
      if (e.value !== 'Select a Team') {
        // console.log(tID);
        // console.log(dID);
        const thisTeam = Teams.findDoc({ name: e.value })._id;
        const devID = Participants.findDoc({ _id: dID }).username;
        // console.log(thisTeam);
        const definitionData = { team: thisTeam, participant: devID };
        const collectionName = TeamInvitations.getCollectionName();
        // console.log(collectionName);
        console.log(thisTeam);
        if (typeof TeamParticipants.findOne({
          teamID: thisTeam,
          participantID: dID,
        }) !== 'undefined') {
          console.log('already in team');
          swal('Error',
              `Sorry, participant ${devID} is already in this team!`,
              'error');
          return;
        }
        /* console.log(typeof TeamDevelopers.findOne({
          teamID: thisTeam,
          developerID: dID,
        }) !== 'undefined');
        console.log(typeof TeamDevelopers.findOne({
          teamID: thisTeam,
          developerID: dID,
        }));
         */

        if (typeof TeamInvitations.findOne({
          teamID: thisTeam,
          participantID: dID,
        }) !== 'undefined') {
          console.log('already invited');
          swal('Error',
              `Sorry, participant ${devID} has already been sent an invitation!`,
              'error');
          return;
        }

        console.log(typeof TeamInvitations.findOne({
          teamID: thisTeam,
          participantID: dID,
        }) !== 'undefined');

        console.log(typeof TeamInvitations.findOne({
          teamID: thisTeam,
          participantID: dID,
        }));

        defineMethod.call({ collectionName: collectionName, definitionData: definitionData },
            (error) => {
              if (error) {
                swal('Error', error.message, 'error');
                console.error(error.message);
              } else {
                swal('Success', 'Invitation sent successfully', 'success');
                console.log('Success');
              }
            });
      }
    }

    return (
        <Item onMouseEnter={changeBackground} onMouseLeave={onLeave}
              style={{ padding: '0rem 2rem 0rem 2rem' }}>
          <Modal closeIcon trigger={
            <Item.Content>
              <Item.Header>
                <Header as={'h3'} style={{ color: '#263763', paddingTop: '2rem' }}>
                  <Icon name='user' size='tiny' />
                  {this.props.developers.firstName} {this.props.developers.lastName}
                </Header>
              </Item.Header>
              <Item.Meta>
                <Item.Meta>
                  <Grid.Column>
                    <Header>About Me</Header>
                    {this.props.developers.aboutMe}
                  </Grid.Column>
                  <Divider hidden/>
                  <Item.Meta>
                  <Grid doubling columns={5}>
                    <Grid.Column>
                      <Header>Challenges</Header>
                      <Grid.Column floated={'left'} style={{ paddingBottom: '0.3rem' }}>
                        {this.props.challenges.slice(0, 3).map((challenge) => <p
                            style={{ color: 'rgb(89, 119, 199)' }}
                            key={challenge}>
                          {challenge}</p>)}
                      </Grid.Column>
                    </Grid.Column>
                    <Grid.Column>
                      <Header>Skills</Header>
                      {this.props.skills.slice(0, 3).map((skill) => <p key={skill}>
                        {skill.name}</p>)}
                    </Grid.Column>
                    <Grid.Column>
                      <Header>Tools</Header>
                      {this.props.tools.slice(0, 3).map((tool) => <p key={tool}>
                        {tool.name}</p>)}
                    </Grid.Column>
                    <Grid.Column>
                      <Header>Interests</Header>
                      {this.props.developers.interest}
                    </Grid.Column>
                    <Grid.Column>
                    <Header>Slack Username</Header>
                    {this.props.developers.username}
                  </Grid.Column>
                    <Grid.Column>
                      <Button.Group style={{ backgroundColor: 'transparent' }}>
                        <Button style={{ backgroundColor: 'transparent' }}>Send Invitation</Button>
                        <Dropdown
                            className='button icon'
                            onChange={handleChange.bind(this, this.props.devID)}
                            options={options}
                            trigger={<></>}
                            style={{ backgroundColor: 'transparent' }}
                        />
                      </Button.Group>
                    </Grid.Column>
                  </Grid>
                  </Item.Meta>
                </Item.Meta>
              </Item.Meta>
            </Item.Content>
          }>
            {/* eslint-disable-next-line max-len */}
            <Modal.Header>{this.props.developers.firstName} {this.props.developers.lastName} <br /> {this.props.developers.demographicLevel}</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <Grid container columns={2}>
                  <Grid.Column><Icon name="github"/>GitHub:<br/>
                    <a href={this.props.developers.gitHub}>{this.props.developers.gitHub}</a>
                  </Grid.Column>
                  <Grid.Column><Icon name="server"/>Website:<br/>
                    <a href={this.props.developers.website}>{this.props.developers.website}</a>
                  </Grid.Column>
                  <Grid.Column><Icon name="linkedin"/>LinkedIn:<br/>
                    <a href={this.props.developers.linkedIn}>{this.props.developers.linkedIn}</a>
                  </Grid.Column>
                  <Grid.Column><Icon name="slack"/>Slack Username:<br/>
                    <a href={this.props.developers.username}>{this.props.developers.username}</a>
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
              <Button.Group style={{ backgroundColor: 'transparent' }}>
                <Button style={{ backgroundColor: 'transparent' }}>Send Invitation</Button>
                <Dropdown
                    className='button icon'
                    onChange={handleChange.bind(this, this.props.devID)}
                    options={options}
                    trigger={<></>}
                    style={{ backgroundColor: 'transparent' }}
                    selection
                    value={value}
                />
              </Button.Group>
            </Modal.Actions>
          </Modal>
        </Item>
    );
  }
}

ListParticipantsCard.propTypes = {
  devID: PropTypes.string.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  interests: PropTypes.array.isRequired,
  developers: PropTypes.object.isRequired,
};
export default withTracker(() => ({
    teamInvitation: TeamInvitations.find({}).fetch(),
  }))(ListParticipantsCard);
