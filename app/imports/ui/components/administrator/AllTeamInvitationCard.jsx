import React from 'react';
import {
  Grid,
  Header,
  Image,
  Item,
  Modal,
  Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { Teams } from '../../../api/team/TeamCollection';

class AllTeamInvitationCard extends React.Component {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {

    function changeBackground(e) {
      e.currentTarget.style.backgroundColor = '#fafafa';
      e.currentTarget.style.cursor = 'pointer';
    }

    function onLeave(e) {
      e.currentTarget.style.backgroundColor = 'transparent';
    }

    const teamID = Teams.findDoc({ name: this.props.teams.name })._id;
    const invitations = TeamInvitations.find({ teamID }).fetch();
    for (let i = 0; i < invitations.length; i++) {
      invitations[i] = invitations[i].participantID;
    }
    const invitedMembers = [];
    _.forEach(invitations, (id) => {
      invitedMembers.push(Participants.getFullName(id));
    });
    return (
        <Item onMouseEnter={changeBackground} onMouseLeave={onLeave}
              style={{ padding: '0rem 2rem 0rem 2rem' }}>
          <Modal closeIcon trigger={
            <Item.Content>
              <Item.Header>
                <Header as={'h3'} style={{ color: '#263763', paddingTop: '2rem' }}>
                  <Icon name='users' size='tiny'/>
                  {this.props.teams.name}
                </Header>
              </Item.Header>
              <Item.Meta>
                <Item.Meta>
                  <Grid doubling columns={5}>
                    <Grid.Column>
                      <Image src={this.props.teams.image} rounded size='small'/>
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
                        {skill}</p>)}
                    </Grid.Column>
                    <Grid.Column>
                      <Header>Tools</Header>
                      {this.props.tools.slice(0, 3).map((tool) => <p key={tool}>
                        {tool}</p>)}
                    </Grid.Column>
                    <Grid.Column>
                      <Header>Member(s) Invited:</Header>
                      {invitedMembers.slice(0, 3).map((members) => <p key={members}>
                        {members}</p>)}
                    </Grid.Column>
                  </Grid>
                </Item.Meta>
              </Item.Meta>
            </Item.Content>
          }>
            <Modal.Header>{this.props.teams.name}</Modal.Header>
            <Modal.Content image scrolling>
              <Image size='medium' src={this.props.teams.image} wrapped/>
              <Modal.Description>
                <Header>Description</Header>
                <p>
                  {this.props.teams.description}
                </p>
                <Header>Challenges</Header>
                {this.props.challenges.map((challenge) => <p key={challenge}>
                  {challenge}</p>)}
                <Header>Skills</Header>
                {this.props.skills.map((skill) => <p key={skill}>
                  {skill}</p>)}
                <Header>Tools</Header>
                {this.props.tools.map((tool) => <p key={tool}>
                  {tool}</p>)}
                <Header>Members</Header>
                {this.props.participants.map((participant) => <p key={participant}>
                  {participant.firstName} {participant.lastName}</p>)}
                <Header>Member(s) Invited:</Header>
                {invitedMembers.slice(0, 3).map((members) => <p key={members}>
                  {members}</p>)}
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Item>
    );
  }
}

AllTeamInvitationCard.propTypes = {
  teams: PropTypes.object.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
};

export default AllTeamInvitationCard;
