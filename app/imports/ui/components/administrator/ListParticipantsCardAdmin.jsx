import React from 'react';
import {
  Grid,
  Header,
  Item,
  Modal,
  Icon,
  List, Divider,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';

class ListParticipantsCardAdmin extends React.Component {
  state = {};

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {

    function changeBackground(e) {
      e.currentTarget.style.backgroundColor = '#fafafa';
      e.currentTarget.style.cursor = 'pointer';
    }

    function onLeave(e) {
      e.currentTarget.style.backgroundColor = 'transparent';
    }

    return (
        <Item onMouseEnter={changeBackground} onMouseLeave={onLeave}
              style={{ padding: '0rem 1.5rem 0.5rem 1.5rem' }}>
          <Modal closeIcon trigger={
            <Item.Content>
              <Item.Header>
                <Header as={'h3'} style={{ color: '#263763', paddingTop: '1.5rem' }}>
                  <Icon name='user' size='tiny' />
                  {this.props.participants.firstName} {this.props.participants.lastName}
                </Header>
              </Item.Header>
              <Item.Description>
                  <Grid.Column>
                    <Header>About Me</Header>
                    {this.props.participants.aboutMe}
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
                      <Header>Slack Username</Header>
                      {this.props.participants.username}
                    </Grid.Column>
                  </Grid>
              </Item.Description>
            </Item.Content>
          }>
            <Modal.Header>
              {this.props.participants.firstName} {this.props.participants.lastName}
              <br /> {this.props.participants.demographicLevel}
            </Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <Grid container columns={2}>
                  <Grid.Column><Icon name="github"/>GitHub:<br/>
                    <a href={this.props.participants.gitHub}>{this.props.participants.gitHub}</a>
                  </Grid.Column>
                  <Grid.Column><Icon name="server"/>Website:<br/>
                    <a href={this.props.participants.website}>{this.props.participants.website}</a>
                  </Grid.Column>
                  <Grid.Column><Icon name="linkedin"/>LinkedIn:<br/>
                    <a href={this.props.participants.linkedIn}>{this.props.participants.linkedIn}</a>
                  </Grid.Column>
                  <Grid.Column><Icon name="slack"/>Slack Username:<br/>
                    <a href={this.props.participants.username}>{this.props.participants.username}</a>
                  </Grid.Column>
                </Grid>
                <Divider hidden/>
                <Grid.Column>
                  <Header dividing size="small">Challenges</Header>
                  <List bulleted>
                    {this.props.challenges.map((challenge, i) => (
                      <List.Item key={challenge + i}>{challenge}</List.Item>
                    ))}
                  </List>
                </Grid.Column>
                <Divider hidden/>
                <Grid.Column>
                  <Header dividing size="small">Skills</Header>
                  <List bulleted>
                    {this.props.skills.map((skill, i) => <List.Item key={skill + i}>{skill.name}</List.Item>)}
                  </List>
                </Grid.Column>
                <Divider hidden/>
                <Grid.Column>
                  <Header dividing size="small">Tools</Header>
                  <List bulleted>
                    {this.props.tools.map((tool, i) => <List.Item key={tool + i}>{tool.name}</List.Item>)}
                  </List>
                </Grid.Column>
                <Divider hidden/>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Item>
    );
  }
}

ListParticipantsCardAdmin.propTypes = {
  participantID: PropTypes.string.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.object.isRequired,
};
export default withTracker(() => ({
    teamInvitation: TeamInvitations.find({}).fetch(),
  }))(ListParticipantsCardAdmin);
