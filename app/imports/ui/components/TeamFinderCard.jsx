import { Meteor } from 'meteor/meteor';
import React from 'react';
import {
  Grid,
  Header,
  Image,
  Popup,
  Item,
  Modal,
  Icon,
  Button,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { WantsToJoin } from '../../api/team/WantToJoinCollection';
import { Developers } from '../../api/user/DeveloperCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Teams } from '../../api/team/TeamCollection';
import { Slugs } from '../../api/slug/SlugCollection';

class TeamFinderCard extends React.Component {
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
                  <Icon name='users' size='tiny'/>
                  {this.props.teams.name}
                </Header>
              </Item.Header>
              <Item.Meta>
                <Item.Meta>
                  <Grid doubling columns={4}>
                    <Grid.Column>
                      <Image src={this.props.teams.image} rounded size='small'/>
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
                        {skill}</p>)}
                    </Grid.Column>
                    <Grid.Column>
                      <Header>Tools</Header>
                      {this.props.tools.map((tool) => <p key={tool}>
                        {tool}</p>)}
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
                {this.props.developers.map((developer) => <p key={developer}>
                  {developer.firstName} {developer.lastName}</p>)}

              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button style={{ backgroundColor: 'rgb(89, 119, 199)', color: 'white' }} onClick={this.handleClick}>
                <Icon name='plus'/>
                Request to join
              </Button>
            </Modal.Actions>
          </Modal>
          <Popup
              content='Request sent!'
              mouseLeaveDelay={200}
              on='click'
              trigger={
                <Button id={this.props.teams._id} style={{ backgroundColor: 'transparent' }} onClick={this.handleClick}>
                  Request to join
                </Button>
              }
          />
        </Item>
    );
  }
}

TeamFinderCard.propTypes = {
  teams: PropTypes.object.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  developers: PropTypes.array.isRequired,
};

export default TeamFinderCard;
