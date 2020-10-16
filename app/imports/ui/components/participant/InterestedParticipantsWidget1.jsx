import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Container, Card, Button, Icon, Label, Header, Menu, Segment, Input } from 'semantic-ui-react';
import { Teams } from '../../../api/team/TeamCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import ListTeamExampleWidget from './ListTeamExampleWidget';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Tools } from '../../../api/tool/ToolCollection';
// import { InterestedParticipants } from '../../../api/team/InterestedParticipantCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { ParticipantInterests } from '../../../api/user/ParticipantInterestCollection';
import { Interests } from '../../../api/interest/InterestCollection';

const getParticipantChallenges = (participant) => {
  const participantID = participant._id;
  const participantChallengeDocs = ParticipantChallenges.find({ participantID }).fetch();
  const challengeTitles = participantChallengeDocs.map((dc) => Challenges.findDoc(dc.challengeID).title);
  return challengeTitles;
};

const getParticipantSkills = (participant) => {
  const participantID = participant._id;
  const participantSkills = ParticipantSkills.find({ participantID }).fetch();
  const skillNames = participantSkills.map((ds) => Skills.findDoc(ds.skillID).name);
  return skillNames;
};

const getParticipantTools = (participant) => {
  const participantID = participant._id;
  const participantTools = ParticipantTools.find({ participantID }).fetch();
  const toolNames = participantTools.map((dt) => Tools.findDoc(dt.toolID).name);
  return toolNames;
};

const getParticipantInterests = (participant) => {
  const participantID = participant._id;
  const participantInterests = ParticipantInterests.find({ participantID }).fetch();
  const interestNames = participantInterests.map((di) => Interests.findDoc(di.interestID).name);
  return interestNames;
};

const getParticipantTeams = (participant) => {
  const participantID = participant._id;
  const participantTeams = TeamParticipants.find({ participantID }).fetch();
  const usersTeams = participantTeams.map((dt) => Teams.findDoc(dt.teamID));
  return usersTeams;
};

const getTeammates = (team, participant) => {
  const teamID = team._id;
  const teamsParticipants = TeamParticipants.find({ teamID }).fetch();
  const teammates = teamsParticipants.map((td) => (
    td.participantID !== participant._id ? Participants.findDoc(td.participantID) : ''
  ));
  return teammates;
};


// const getInterestedParticipants = (team) => {
//   const teamID = team._id;
//   const InterestedParticipants = WantsToJoin.find({ teamID }).fetch();
//   const interestedParticipants = InterestedParticipants.map((wd) => Participants.findDoc(wd.participantID));
//   return interestedParticipants;
// };


class TeammatesWidget extends React.Component {
  state = { 
    activeItem: 'test',
    tab: 'tab 1',
    activeTeam: 'team 1'

  }

  componentDidMount() {
    const participant = Participants.findDoc({ userID: Meteor.userId() });
    const usersTeams = getParticipantTeams(participant);
    this.setState({activeItem: usersTeams[0].name, activeTab: usersTeams[0].name});
  }


  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name, tab: name });
  }

  render() {
    const participant = Participants.findDoc({ userID: Meteor.userId() });
    const usersTeams = getParticipantTeams(participant);
    const { activeItem, tab } = this.state

    return (
      <Container>
        <Menu attached='top' tabular>
          {usersTeams.map(usersTeam => (
            <Menu.Item
              name={usersTeam.name}
              active={activeItem === usersTeam.name}
              onClick={this.handleItemClick}
              key={usersTeam._id}
            />
          ))}
          <Menu.Menu position='right'>
            <Menu.Item>
              <Input
                transparent
                icon={{ name: 'search', link: true }}
                placeholder='Search users...'
              />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <div>
          <br></br>
          <Header>Participants Interested in Joining {tab}</Header>
          <Card.Group>
            {this.props.participants.map((participant) => (
              <Card key={participant._id}>
                <Card.Content>
                  <Card.Header>{participant.firstName} {participant.lastName}</Card.Header>
                  <Card.Meta>                
                    <a href={participant.website} target="_blank">
                        <Icon name='globe' link color='blue'/>
                      </a>
                      <a href={participant.gitHub} target="_blank">
                        <Icon name='github' link color='blue'/>
                      </a>
                      <a href={participant.linkedIn} target="_blank">
                        <Icon name='linkedin' link color='blue'/>
                      </a>
                      <p style={{float: 'right', fontStyle: 'italic'}}>{participant.demographicLevel}</p>
                  </Card.Meta>
                  <Card.Description>
                    {participant.aboutMe}
                  </Card.Description>
                </Card.Content>
                {getParticipantChallenges(participant).length > 0 ? (
                    <Card.Content extra>
                      {/* <h4 style={{color: 'black'}}>Skills</h4> */}
                      <h5 style={{color: 'black', marginBottom: '0.5rem'}}>Challenges: </h5>
                      {getParticipantChallenges(participant).map(challengeName => 
                        [ <span style={{color: 'black'}} key={challengeName}>- {challengeName}</span>,
                          <br></br>,
                        ]
                      )}
                    </Card.Content>
                  ) : ''
                }
                {getParticipantSkills(participant).length > 0 ? (
                    <Card.Content extra>
                      {/* <h4 style={{color: 'black'}}>Skills</h4> */}
                      <strong style={{color: 'black'}}>Skills: </strong>
                      {getParticipantSkills(participant).map(skillName => 
                        <Label as='a' color='blue' key={skillName}>{skillName}</Label>
                      )}
                    </Card.Content>
                  ) : ''
                }
                {getParticipantTools(participant).length > 0 ? (
                    <Card.Content extra>
                      {/* <h4 style={{color: 'black'}}>Tools</h4> */}
                      <strong style={{color: 'black'}}>Tools: </strong>
                      {getParticipantTools(participant).map(ToolName => 
                        <Label as='a' color='blue' key={ToolName} >{ToolName}</Label>
                      )}
                    </Card.Content>
                  ) : ''
                }
                {getParticipantInterests(participant).length > 0 ? (
                    <Card.Content extra>
                      {/* <h4 style={{color: 'black'}}>Interests</h4> */}
                      <strong style={{color: 'black'}}>Interests: </strong>
                      {getParticipantInterests(participant).map(InterestName => 
                        <Label as='a' color='blue' key={InterestName} >{InterestName}</Label>
                      )}
                    </Card.Content>
                  ) : ''
                }
                <Card.Content extra>
                  <div className='ui two buttons'>
                    <Button basic color='green'>
                      Approve
                    </Button>
                    <Button basic color='red'>
                      Decline
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </div>
      </Container>


      // usersTeams.map(usersTeam => (
      //   <Segment>
      //     <Header as='h1'>{usersTeam.name}</Header>
      //     <Card.Group>
      //       {this.props.participants.map((participant) => (
      //         <Card key={participant._id}>
      //           <Card.Content>
      //             <Card.Header>{participant.firstName} {participant.lastName}</Card.Header>
      //             <Card.Meta>                
      //               <a href={participant.website} target="_blank">
      //                   <Icon name='globe' link color='blue'/>
      //                 </a>
      //                 <a href={participant.gitHub} target="_blank">
      //                   <Icon name='github' link color='blue'/>
      //                 </a>
      //                 <a href={participant.linkedIn} target="_blank">
      //                   <Icon name='linkedin' link color='blue'/>
      //                 </a>
      //                 <p style={{float: 'right', fontStyle: 'italic'}}>{participant.demographicLevel}</p>
      //             </Card.Meta>
      //             <Card.Description>
      //               {participant.aboutMe}
      //             </Card.Description>
      //           </Card.Content>
      //           {getParticipantChallenges(participant).length > 0 ? (
      //               <Card.Content extra>
      //                 {/* <h4 style={{color: 'black'}}>Skills</h4> */}
      //                 <h5 style={{color: 'black', marginBottom: '0.5rem'}}>Challenges: </h5>
      //                 {getParticipantChallenges(participant).map(challengeName => 
      //                   [ <span style={{color: 'black'}} key={challengeName}>- {challengeName}</span>,
      //                     <br></br>,
      //                   ]
      //                 )}
      //               </Card.Content>
      //             ) : ''
      //           }
      //           {getParticipantSkills(participant).length > 0 ? (
      //               <Card.Content extra>
      //                 {/* <h4 style={{color: 'black'}}>Skills</h4> */}
      //                 <strong style={{color: 'black'}}>Skills: </strong>
      //                 {getParticipantSkills(participant).map(skillName => 
      //                   <Label as='a' color='blue' key={skillName}>{skillName}</Label>
      //                 )}
      //               </Card.Content>
      //             ) : ''
      //           }
      //           {getParticipantTools(participant).length > 0 ? (
      //               <Card.Content extra>
      //                 {/* <h4 style={{color: 'black'}}>Tools</h4> */}
      //                 <strong style={{color: 'black'}}>Tools: </strong>
      //                 {getParticipantTools(participant).map(ToolName => 
      //                   <Label as='a' color='blue' key={ToolName} >{ToolName}</Label>
      //                 )}
      //               </Card.Content>
      //             ) : ''
      //           }
      //           {getParticipantInterests(participant).length > 0 ? (
      //               <Card.Content extra>
      //                 {/* <h4 style={{color: 'black'}}>Interests</h4> */}
      //                 <strong style={{color: 'black'}}>Interests: </strong>
      //                 {getParticipantInterests(participant).map(InterestName => 
      //                   <Label as='a' color='blue' key={InterestName} >{InterestName}</Label>
      //                 )}
      //               </Card.Content>
      //             ) : ''
      //           }
      //           <Card.Content extra>
      //             <div className='ui two buttons'>
      //               <Button basic color='green'>
      //                 Approve
      //               </Button>
      //               <Button basic color='red'>
      //                 Decline
      //               </Button>
      //             </div>
      //           </Card.Content>
      //         </Card>
      //       ))}
      //     </Card.Group>
      //   </Segment>
      // ))

    );
  }
}

TeammatesWidget.propTypes = {
  participants: PropTypes.arrayOf(
      PropTypes.object,
  ),
};

export default withTracker(() => {
  const participants = Participants.find({}).fetch();
  return {
    participants,
  };
})(TeammatesWidget);