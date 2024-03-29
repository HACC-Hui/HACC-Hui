import React from 'react';
import {
  Grid,
  Header,
  Item,
  Icon,
  Segment,
  Input,
  Dropdown, Button, Checkbox,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
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
import { databaseFileDateFormat } from '../../pages/administrator/DumpDatabase';

class ListParticipantsWidgetAdmin extends React.Component {

  constructor(props) {
    super(props);
    // console.log(props.participants);
    this.state = {
      search: '',
      challenges: [],
      tools: [],
      skills: [],
      teams: [],
      noTeamCheckbox: false,
      multipleTeamsCheckbox: false,
      compliantCheckbox: false,
      result: _.orderBy(this.props.participants, ['name'], ['asc']),
    };
  }

  render() {
    // console.log(this.props);
    // console.log(this.state.result);
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
      // const noTeamResults = filters.filterNoTeam(this.props.teamParticipants, teamResults);
      const sorted = _.uniqBy(filters.sortBy(teamResults, 'participants'), 'username');
      // console.log(sorted);
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

    const handleDownload = () => {
      const zip = new ZipZap();
      const dir = 'hacchui-participants';
      const fileName = `${dir}/${moment().format(databaseFileDateFormat)}-participants.txt`;
      const participants = this.state.result;
      const emails = participants.map(p => p.username);
      zip.file(fileName, emails.join('\n'));
      zip.saveAs(`${dir}.zip`);
    };

    const handleMultipleTeams = () => {
      if (!this.state.multipleTeamsCheckbox) {
        const participants = this.state.result;
        const results = filters.filterMultipleTeams(this.props.teamParticipants, participants);
        const sorted = _.uniqBy(filters.sortBy(results, 'participants'), 'username');
        this.setState({
          result: sorted,
        }, () => {
        });
      } else {
        this.setState({
          result: this.props.participants,
        }, () => {
        });

      }
      const checked = this.state.multipleTeamsCheckbox;
      this.setState({ multipleTeamsCheckbox: !checked });
    };

    const handleNoTeam = () => {
      if (!this.state.noTeamCheckbox) {
        const participants = this.state.result;
        const results = filters.filterNoTeam(this.props.teamParticipants, participants);
        const sorted = _.uniqBy(filters.sortBy(results, 'participants'), 'username');
        this.setState({
          result: sorted,
        }, () => {
        });
      } else {
        this.setState({
          result: this.props.participants,
        }, () => {
        });
      }
      const checked = this.state.noTeamCheckbox;
      this.setState({ noTeamCheckbox: !checked });
    };

    const handleNotCompliant = () => {
      if (!this.state.compliantCheckbox) {
        const participants = this.state.result;
        const results = participants.filter(p => !p.isCompliant);
        const sorted = _.uniqBy(filters.sortBy(results, 'participants'), 'username');
        this.setState({
          result: sorted,
        }, () => {
        });
      } else {
        this.setState({
          result: this.props.participants,
        }, () => {
        });
      }
      const checked = this.state.compliantCheckbox;
      this.setState({ compliantCheckbox: !checked });
    };

    const filterStyle = {
      paddingTop: 4,
    };
    // console.log(this.state.result);
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
          <Grid.Row centered>
            <Grid.Column>
              <Button onClick={handleDownload}>Download emails</Button>
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
                <Checkbox onChange={handleNoTeam} label="No Team"/>
                <Checkbox onChange={handleMultipleTeams} label="Multiple Teams"/>
                <Checkbox onChange={handleNotCompliant} label="Not Compliant"/>
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

export default withTracker(() => {
  const participantChallenges = ParticipantChallenges.find({}).fetch();
  const participantSkills = ParticipantSkills.find({}).fetch();
  const participantTools = ParticipantTools.find({}).fetch();
  const teams = Teams.find({}).fetch();
  const teamParticipants = TeamParticipants.find({}).fetch();
  const skills = Skills.find({}).fetch();
  const challenges = Challenges.find({}).fetch();
  const tools = Tools.find({}).fetch();
  const participants = Participants.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  // console.log(participants);
  return {
    participantChallenges,
    participantSkills,
    participantTools,
    teams,
    teamParticipants,
    skills,
    challenges,
    tools,
    participants,
  };
})(ListParticipantsWidgetAdmin);
