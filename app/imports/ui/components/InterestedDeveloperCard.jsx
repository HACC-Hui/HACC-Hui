import React from 'react';
import {
  Grid,
  Header,
  Item,
  Modal,
  Icon, Button,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { TeamDevelopers } from '../../api/team/TeamDeveloperCollection';
import { defineMethod, removeItMethod } from '../../api/base/BaseCollection.methods';
import { InterestedDevs } from '../../api/team/InterestedDeveloperCollection';

class InterestedDeveloperCard extends React.Component {
  isAdded(tID, dID) {
    console.log(typeof TeamDevelopers.findOne({ teamID: tID, developerID: dID }) !== 'undefined');
    if (typeof TeamDevelopers.findOne({ teamID: tID, developerID: dID }) !== 'undefined') {
      return true;
    }
    return false;
  }

  handleClick(tID, dID, e) {
    console.log(e);
    // console.log(tID);
    // console.log(dID);
    const thisTeam = tID;
    const devID = dID;
    // console.log(thisTeam);
    const definitionData = { team: thisTeam, developer: devID };
    const collectionName = TeamDevelopers.getCollectionName();
    // console.log(collectionName);
    defineMethod.call({ collectionName: collectionName, definitionData: definitionData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
            // console.error(error.message);
          } else {
            swal('Success', 'Member added successfully', 'success');
            // console.log('Success');
          }
        });
    const collectionName2 = InterestedDevs.getCollectionName();
    // console.log(collectionName2, devID);
    const intID = InterestedDevs.findDoc({ developerID: devID })._id;
    // console.log(intID);
    removeItMethod.call({ collectionName: collectionName2, instance: intID }, (error) => {
      if (error) {
        console.error('Failed to remove', error);
      }
    });
  }

  removeDev(dID, e) {
    console.log(e);
    const devID = dID;
    const collectionName2 = InterestedDevs.getCollectionName();
    // console.log(collectionName2, devID);
    const intID = InterestedDevs.findDoc({ developerID: devID })._id;
    // console.log(intID);
    removeItMethod.call({ collectionName: collectionName2, instance: intID }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
        // console.error(error.message);
      } else {
        swal('Success', 'Removed Interested Developer', 'success');
        // console.log('Success');
      }
    });
  }

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
                  <Grid doubling columns={5}>
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
              {!this.isAdded(this.props.teams[0]._id, this.props.developers._id) ? (
                  // eslint-disable-next-line max-len
                  <Button id={this.props.teams._id} style={{ backgroundColor: 'rgb(89, 119, 199)', color: 'white' }} onClick={this.handleClick.bind(this, this.props.teams[0]._id, this.props.developers._id)}>
                    <Icon name='plus'/>
                    Add member
                  </Button>
              ) : ''}
              {this.isAdded(this.props.teams[0]._id, this.props.developers._id) ? (
                  // eslint-disable-next-line max-len
                  <Button id={this.props.teams._id} style={{ backgroundColor: 'rgb(89, 119, 199)', color: 'white' }} disabled>
                    <Icon name='plus'/>
                    Member already added
                  </Button>
              ) : '' }
              {/* eslint-disable-next-line max-len */}
              <Button id={this.props.teams._id} style={{ backgroundColor: 'rgb(192, 0, 0)', color: 'white' }} onClick={this.removeDev.bind(this, this.props.developers._id)}>
                Remove
              </Button>
            </Modal.Actions>
          </Modal>
          {!this.isAdded(this.props.teams[0]._id, this.props.developers._id) ? (
              // eslint-disable-next-line max-len
              <Button id={this.props.teams._id} style={{ backgroundColor: 'transparent' }} onClick={this.handleClick.bind(this, this.props.teams[0]._id, this.props.developers._id)}>
                Add member
              </Button>
          ) : ''}
          {this.isAdded(this.props.teams[0]._id, this.props.developers._id) ? (
              <Button id={this.props.teams._id} style={{ backgroundColor: 'transparent' }} disabled>
                Member already added
              </Button>
          ) : '' }
          {/* eslint-disable-next-line max-len */}
          <Button id={this.props.teams._id} style={{ backgroundColor: 'transparent' }} onClick={this.removeDev.bind(this, this.props.developers._id)}>
            Remove
          </Button>
        </Item>
    );
  }
}

InterestedDeveloperCard.propTypes = {
  teams: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  developers: PropTypes.object.isRequired,
};

export default InterestedDeveloperCard;
