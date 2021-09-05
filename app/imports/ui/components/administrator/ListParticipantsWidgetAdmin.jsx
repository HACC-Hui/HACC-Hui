import React from 'react';
import {
  Grid,
  Header,
  Item,
  Icon,
  Segment,
  Input,
  Dropdown,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import ListParticipantCardAdmin from './ListParticipantsCardAdmin';
import ListParticipantsFilterAdmin from './ListParticipantsFilterAdmin';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';

class ListParticipantsWidgetAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      challenges: [],
      tools: [],
      skills: [],
      teams: [],
      result: _.orderBy(this.props.participants, ['name'], ['asc']),
    };
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */

  render() {
    // console.log(this.props);

    if (this.props.participants.length === 0) {
      return (
        <div align={'center'}>
          <Header as='h2' icon>
            <Icon name='users' />
            There are no participants at the moment.
            <Header.Subheader>
              Please check back later.
            </Header.Subheader>
          </Header>
        </div>
      );
    }

    const sticky = {
      position1: '-webkit-sticky',
      position: 'sticky',
      top: '6.5rem',
    };

    const filters = new ListParticipantsFilterAdmin();

    const setFilters = () => {
      const searchResults = filters.filterBySearch(this.props.participants, this.state.search);
      const skillResults = filters.filterBySkills(this.state.skills,
        this.props.skills, this.props.participantSkills, searchResults);
      const toolResults = filters.filterByTools(this.state.tools,
        this.props.tools, this.props.participantTools, skillResults);
      const challengeResults = filters.filterByChallenge(this.state.challenges,
        this.props.challenges, this.props.participantChallenges, toolResults);
      const teamResults = filters.filterByTeam(this.state.teams, this.props.teams,
        this.props.teamParticipants, challengeResults);
      const sorted = filters.sortBy(teamResults, 'participants');
      this.setState({
        result: sorted,
      }, () => {
      });
    };

    const handleSearchChange = (event) => {
      this.setState({
        search: event.target.value,
      }, () => {
        setFilters();
      });
    };

    const getSkills = (event, { value }) => {
      this.setState({
        skills: value,
      }, () => {
        setFilters();
      });
    };

    const getTools = (event, { value }) => {
      this.setState({
        tools: value,
      }, () => {
        setFilters();
      });
    };

    const getChallenge = (event, { value }) => {
      this.setState({
        challenges: value,
      }, () => {
        setFilters();
      });
    };

    const getTeam = (event, { value }) => {
      this.setState({
        teams: value,
      }, () => {
        setFilters();
      });
    };

    const universalSkills = this.props.skills;

    function getParticipantSkills(participantID, participantSkills) {
      const data = [];
      const skills = _.filter(participantSkills, { participantID: participantID });
      for (let i = 0; i < skills.length; i++) {
        for (let j = 0; j < universalSkills.length; j++) {
          if (skills[i].skillID === universalSkills[j]._id) {
            data.push({ name: universalSkills[j].name });
          }
        }
      }
      // console.log(data);
      return data;
    }

    const universalTools = this.props.tools;

    function getParticipantTools(participantID, participantTools) {
      const data = [];
      const tools = _.filter(participantTools, { participantID: participantID });
      for (let i = 0; i < tools.length; i++) {
        for (let j = 0; j < universalTools.length; j++) {
          if (tools[i].toolID === universalTools[j]._id) {
            data.push({ name: universalTools[j].name });
          }
        }
      }
      return data;
    }

    const universalChallenges = this.props.challenges;

    function getParticipantChallenges(participantID, participantChallenges) {
      const data = [];
      const challenges = _.filter(participantChallenges, { participantID: participantID });
      for (let i = 0; i < challenges.length; i++) {
        for (let j = 0; j < universalChallenges.length; j++) {
          if (challenges[i].challengeID === universalChallenges[j]._id) {
            data.push(universalChallenges[j].title);
          }
        }
      }
      return data;
    }

    const universalTeams = this.props.teams;
    function getParticipantTeams(participantID, teamParticipants) {
      const data = [];
      const teams = _.filter(teamParticipants, { participantID: participantID });
      for (let i = 0; i < teams.length; i++) {
        for (let j = 0; j < universalTeams.length; j++) {
          if (teams[i].teamID === universalTeams[j]._id) {
            data.push(universalTeams[j].name);
          }
        }
      }
      return data;
    }
    const filterStyle = {
      paddingTop: 4,
    };
    return (
      <div style={{ paddingBottom: '50px' }}>
        <Grid container doubling relaxed stackable centered>
          <Grid.Row centered>
            <Grid.Column width={16}>
              <div style={{
                backgroundColor: '#E5F0FE', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem',
              }}>
                <Header as={'h2'} textAlign="center">
                  All Participants
                </Header>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Column width={4}>
            <Segment style={sticky}>
              <div style={filterStyle}>
                <Header>
                  <Header.Content>
                    Filter Participants
                    <Header.Subheader>Total Participants: {this.state.result.length}</Header.Subheader>
                  </Header.Content>
                </Header>
              </div>
              <div style={filterStyle}>
                <Input icon='search'
                       iconPosition='left'
                       placeholder='Search by participants name...'
                       onChange={handleSearchChange}
                       fluid
                />

                <div style={filterStyle}>
                  <Header>Teams</Header>
                  <Dropdown
                    placeholder='Teams'
                    fluid
                    multiple
                    search
                    selection
                    options={filters.dropdownValues(this.props.teams, 'name')}
                    onChange={getTeam}
                  />
                </div>

                <div style={filterStyle}>
                  <Header>Challenges</Header>
                  <Dropdown
                    placeholder='Challenges'
                    fluid
                    multiple
                    search
                    selection
                    options={filters.dropdownValues(this.props.challenges, 'title')}
                    onChange={getChallenge}
                  />
                </div>
              </div>
              <div style={filterStyle}>
                <Header>Skills</Header>
                <Dropdown placeholder='Skills'
                          fluid
                          multiple
                          search
                          selection
                          options={filters.dropdownValues(this.props.skills, 'name')}
                          onChange={getSkills}
                />
              </div>
              <div style={filterStyle}>
                <Header>Tools</Header>
                <Dropdown
                  placeholder='Tools'
                  fluid
                  multiple
                  search
                  selection
                  options={filters.dropdownValues(this.props.tools, 'name')}
                  onChange={getTools}
                />
              </div>
              <Segment>Download buttons</Segment>
            </Segment>
          </Grid.Column>
          <Grid.Column width={12}>
            <Item.Group divided>
              {this.state.result.map((participants) => <ListParticipantCardAdmin
                key={participants._id}
                participantID={participants._id}
                participants={participants}
                skills={getParticipantSkills(participants._id, this.props.participantSkills)}
                tools={getParticipantTools(participants._id, this.props.participantTools)}
                challenges={getParticipantChallenges(participants._id, this.props.participantChallenges)}
                teams={getParticipantTeams(participants._id, this.props.teamParticipants)}
              />)}
            </Item.Group>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

ListParticipantsWidgetAdmin.propTypes = {
  participantChallenges: PropTypes.array.isRequired,
  participantSkills: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  participantTools: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  teamParticipants: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,

};

export default withTracker(() => ({
  participantChallenges: ParticipantChallenges.find({}).fetch(),
  participantSkills: ParticipantSkills.find({}).fetch(),
  participantTools: ParticipantTools.find({}).fetch(),
  teams: Teams.find({}).fetch(),
  teamParticipants: TeamParticipants.find({}).fetch(),
  skills: Skills.find({}).fetch(),
  challenges: Challenges.find({}).fetch(),
  tools: Tools.find({}).fetch(),
  participants: Participants.find({}).fetch(),

}))(ListParticipantsWidgetAdmin);
