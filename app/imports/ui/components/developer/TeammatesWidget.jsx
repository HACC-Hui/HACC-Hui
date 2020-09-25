import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Container, Card, Button, Icon, Label, Header, Menu, Segment, Input } from 'semantic-ui-react';
import { Teams } from '../../../api/team/TeamCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import ListTeamExampleWidget from './ListTeamExampleWidget';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { DeveloperChallenges } from '../../../api/user/DeveloperChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { DeveloperSkills } from '../../../api/user/DeveloperSkillCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { DeveloperTools } from '../../../api/user/DeveloperToolCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { TeamDevelopers } from '../../../api/team/TeamDeveloperCollection';
import { DeveloperInterests } from '../../../api/user/DeveloperInterestCollection';
import { Interests } from '../../../api/interest/InterestCollection';

const getDeveloperChallenges = (developer) => {
  const developerID = developer._id;
  const developerChallengeDocs = DeveloperChallenges.find({ developerID }).fetch();
  const challengeTitles = developerChallengeDocs.map((dc) => Challenges.findDoc(dc.challengeID).title);
  return challengeTitles;
};

const getDeveloperSkills = (developer) => {
  const developerID = developer._id;
  const developerSkills = DeveloperSkills.find({ developerID }).fetch();
  const skillNames = developerSkills.map((ds) => Skills.findDoc(ds.skillID).name);
  return skillNames;
};

const getDeveloperTools = (developer) => {
  const developerID = developer._id;
  const developerTools = DeveloperTools.find({ developerID }).fetch();
  const toolNames = developerTools.map((dt) => Tools.findDoc(dt.toolID).name);
  return toolNames;
};

const getDeveloperInterests = (developer) => {
  const developerID = developer._id;
  const developerInterests = DeveloperInterests.find({ developerID }).fetch();
  const interestNames = developerInterests.map((di) => Interests.findDoc(di.interestID).name);
  return interestNames;
};

const getDeveloperTeams = (developer) => {
  const developerID = developer._id;
  const developerTeams = TeamDevelopers.find({ developerID }).fetch();
  const usersTeams = developerTeams.map((dt) => Teams.findDoc(dt.teamID));
  return usersTeams;
};

const getTeammates = (team, developer) => {
  const teamID = team._id;
  const teamsDevelopers = TeamDevelopers.find({ teamID }).fetch();
  const teammates = teamsDevelopers.map((td) => (
    td.developerID !== developer._id ? Developers.findDoc(td.developerID) : ''
  ));
  return teammates;
};

const getInterestedDevs = (team) => {
  const teamID = team._id;
  const wantsToJoinTeam = WantsToJoin.find({ teamID }).fetch();
  const interestedDevs = wantsToJoinTeam.map((wd) => Developers.findDoc(wd.developerID));
  return interestedDevs;
};


class TeammatesWidget extends React.Component {
  state = { 
    activeItem: 'test',
    tab: 'tab 1',
    activeTeam: 'team 1'

  }

  componentDidMount() {
    const developer = Developers.findDoc({ userID: Meteor.userId() });
    const usersTeams = getDeveloperTeams(developer);
    this.setState({activeItem: usersTeams[0].name, activeTab: usersTeams[0].name});
  }


  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name, tab: name });
  }

  render() {
    const developer = Developers.findDoc({ userID: Meteor.userId() });
    const usersTeams = getDeveloperTeams(developer);
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
          <Header>Developers Interested in Joining {tab}</Header>
          <Card.Group>
            {this.props.developers.map((developer) => (
              <Card key={developer._id}>
                <Card.Content>
                  <Card.Header>{developer.firstName} {developer.lastName}</Card.Header>
                  <Card.Meta>                
                    <a href={developer.website} target="_blank">
                        <Icon name='globe' link color='blue'/>
                      </a>
                      <a href={developer.gitHub} target="_blank">
                        <Icon name='github' link color='blue'/>
                      </a>
                      <a href={developer.linkedIn} target="_blank">
                        <Icon name='linkedin' link color='blue'/>
                      </a>
                      <p style={{float: 'right', fontStyle: 'italic'}}>{developer.demographicLevel}</p>
                  </Card.Meta>
                  <Card.Description>
                    {developer.aboutMe}
                  </Card.Description>
                </Card.Content>
                {getDeveloperChallenges(developer).length > 0 ? (
                    <Card.Content extra>
                      {/* <h4 style={{color: 'black'}}>Skills</h4> */}
                      <h5 style={{color: 'black', marginBottom: '0.5rem'}}>Challenges: </h5>
                      {getDeveloperChallenges(developer).map(challengeName => 
                        [ <span style={{color: 'black'}} key={challengeName}>- {challengeName}</span>,
                          <br></br>,
                        ]
                      )}
                    </Card.Content>
                  ) : ''
                }
                {getDeveloperSkills(developer).length > 0 ? (
                    <Card.Content extra>
                      {/* <h4 style={{color: 'black'}}>Skills</h4> */}
                      <strong style={{color: 'black'}}>Skills: </strong>
                      {getDeveloperSkills(developer).map(skillName => 
                        <Label as='a' color='blue' key={skillName}>{skillName}</Label>
                      )}
                    </Card.Content>
                  ) : ''
                }
                {getDeveloperTools(developer).length > 0 ? (
                    <Card.Content extra>
                      {/* <h4 style={{color: 'black'}}>Tools</h4> */}
                      <strong style={{color: 'black'}}>Tools: </strong>
                      {getDeveloperTools(developer).map(ToolName => 
                        <Label as='a' color='blue' key={ToolName} >{ToolName}</Label>
                      )}
                    </Card.Content>
                  ) : ''
                }
                {getDeveloperInterests(developer).length > 0 ? (
                    <Card.Content extra>
                      {/* <h4 style={{color: 'black'}}>Interests</h4> */}
                      <strong style={{color: 'black'}}>Interests: </strong>
                      {getDeveloperInterests(developer).map(InterestName => 
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
      //       {this.props.developers.map((developer) => (
      //         <Card key={developer._id}>
      //           <Card.Content>
      //             <Card.Header>{developer.firstName} {developer.lastName}</Card.Header>
      //             <Card.Meta>                
      //               <a href={developer.website} target="_blank">
      //                   <Icon name='globe' link color='blue'/>
      //                 </a>
      //                 <a href={developer.gitHub} target="_blank">
      //                   <Icon name='github' link color='blue'/>
      //                 </a>
      //                 <a href={developer.linkedIn} target="_blank">
      //                   <Icon name='linkedin' link color='blue'/>
      //                 </a>
      //                 <p style={{float: 'right', fontStyle: 'italic'}}>{developer.demographicLevel}</p>
      //             </Card.Meta>
      //             <Card.Description>
      //               {developer.aboutMe}
      //             </Card.Description>
      //           </Card.Content>
      //           {getDeveloperChallenges(developer).length > 0 ? (
      //               <Card.Content extra>
      //                 {/* <h4 style={{color: 'black'}}>Skills</h4> */}
      //                 <h5 style={{color: 'black', marginBottom: '0.5rem'}}>Challenges: </h5>
      //                 {getDeveloperChallenges(developer).map(challengeName => 
      //                   [ <span style={{color: 'black'}} key={challengeName}>- {challengeName}</span>,
      //                     <br></br>,
      //                   ]
      //                 )}
      //               </Card.Content>
      //             ) : ''
      //           }
      //           {getDeveloperSkills(developer).length > 0 ? (
      //               <Card.Content extra>
      //                 {/* <h4 style={{color: 'black'}}>Skills</h4> */}
      //                 <strong style={{color: 'black'}}>Skills: </strong>
      //                 {getDeveloperSkills(developer).map(skillName => 
      //                   <Label as='a' color='blue' key={skillName}>{skillName}</Label>
      //                 )}
      //               </Card.Content>
      //             ) : ''
      //           }
      //           {getDeveloperTools(developer).length > 0 ? (
      //               <Card.Content extra>
      //                 {/* <h4 style={{color: 'black'}}>Tools</h4> */}
      //                 <strong style={{color: 'black'}}>Tools: </strong>
      //                 {getDeveloperTools(developer).map(ToolName => 
      //                   <Label as='a' color='blue' key={ToolName} >{ToolName}</Label>
      //                 )}
      //               </Card.Content>
      //             ) : ''
      //           }
      //           {getDeveloperInterests(developer).length > 0 ? (
      //               <Card.Content extra>
      //                 {/* <h4 style={{color: 'black'}}>Interests</h4> */}
      //                 <strong style={{color: 'black'}}>Interests: </strong>
      //                 {getDeveloperInterests(developer).map(InterestName => 
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
  developers: PropTypes.arrayOf(
      PropTypes.object,
  ),
};

export default withTracker(() => {
  const developers = Developers.find({}).fetch();
  return {
    developers,
  };
})(TeammatesWidget);
