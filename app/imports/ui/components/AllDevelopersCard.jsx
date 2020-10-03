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
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { TeamInvitations } from '../../api/team/TeamInvitationCollection';
import { Teams } from '../../api/team/TeamCollection';
import { Developers } from '../../api/user/DeveloperCollection';

class AllDevelopersCard extends React.Component {
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

  handleChange(dID, { value }, e) {
    console.log(e);
    console.log(e.value);
    console.log(dID);
    if (e.value !== 'Select a Team') {
      // console.log(tID);
      // console.log(dID);
      const thisTeam = Teams.findDoc({ name: e.value })._id;
      const devID = Developers.findDoc({ _id: dID }).username;
      // console.log(thisTeam);
      const definitionData = { team: thisTeam, developer: devID };
      const collectionName = TeamInvitations.getCollectionName();
      // console.log(collectionName);
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
      const teams = Teams.find({ owner: Developers.findDoc({ userID: Meteor.userId() })._id }).fetch();
      const newOptions = [];
      newOptions.push({ key: 'Select a Team', text: 'Select a Team', value: 'Select a Team' });
      for (let i = 0; i < teams.length; i++) {
        newOptions.push({ key: teams[i].name, text: teams[i].name, value: teams[i].name });
      }
      console.log(newOptions);
      return newOptions;
    }

    const options = setOptions();

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
                  <Grid doubling columns={6}>
                    <Grid.Column>
                      <Grid.Column floated={'left'} style={{ paddingBottom: '0.3rem' }}>
                        {this.props.challenges.map((challenge) => <p
                            style={{ color: 'rgb(89, 119, 199)' }}
                            key={challenge}>
                          {challenge}</p>)}
                      </Grid.Column>

                    </Grid.Column>
                    <Grid.Column>
                      <Header>Skills</Header>
                      {this.props.skills.map((skill) => <p key={skill}>
                        {skill.name}</p>)}
                    </Grid.Column>
                    <Grid.Column>
                      <Header>Tools</Header>
                      {this.props.tools.map((tool) => <p key={tool}>
                        {tool.name}</p>)}
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
                            onChange={this.handleChange.bind(this, this.props.devID)}
                            options={options}
                            trigger={<></>}
                            style={{ backgroundColor: 'transparent' }}
                        />
                      </Button.Group>
                    </Grid.Column>
                  </Grid>
                </Item.Meta>
              </Item.Meta>

            </Item.Content>
          }>
            <Modal.Header>{this.props.developers.firstName} {this.props.developers.lastName}</Modal.Header>
            <Modal.Content image scrolling>
              <Modal.Description>
                <Header>About Me</Header>
                <p>
                  {this.props.developers.aboutMe}
                </p>
                <Header>Slack Username</Header>
                <p>
                {this.props.developers.username}
                </p>
                <Header>LinkedIn</Header>
                <p>
                  {this.props.developers.linkedIn}
                </p>
                <Header>GitHub</Header>
                <p>
                  {this.props.developers.gitHub}
                </p>
                <Header>Website</Header>
                <p>
                  {this.props.developers.website}
                </p>
                <Header>Challenges</Header>
                <p>
                  {this.props.challenges.map((challenge) => <p key={challenge}>
                    {challenge}</p>)}
                </p>
                <Header>Skills</Header>
                <p>
                  {this.props.skills.map((skill) => <p key={skill}>
                    {skill.name}: {skill.level}</p>)}
                </p>
                <Header>Tools</Header>
                <p>
                  {this.props.tools.map((tool) => <p key={tool}>
                    {tool.name}: {tool.level}</p>)}
                </p>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button.Group style={{ backgroundColor: 'transparent' }}>
                <Button style={{ backgroundColor: 'transparent' }}>Send Invitation</Button>
                <Dropdown
                    className='button icon'
                    onChange={this.handleChange.bind(this, this.props.devID)}
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

AllDevelopersCard.propTypes = {
  devID: PropTypes.string.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  developers: PropTypes.object.isRequired,
};
export default AllDevelopersCard;
