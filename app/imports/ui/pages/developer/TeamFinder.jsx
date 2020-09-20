import React from 'react';
import {
  Grid,
  Segment,
  Header,
  Loader,
  Dropdown,
  Input,
  Item,
  Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamDevelopers } from '../../../api/team/TeamDeveloperCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import TeamFinderFilter from '../../components/TeamFinderFilter';
import TeamFinderCard from '../../components/TeamFinderCard';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class TeamFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      challenges: [],
      tools: [],
      skills: [],
      result: _.orderBy(this.props.teams, ['name'], ['asc']),
    };
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {

    if (this.props.teams.length === 0) {
      return (
          <div align={'center'}>
            <Header as='h2' icon>
              <Icon name='users'/>
              There are no available teams at the moment.
              <Header.Subheader>
                Please check back later.
              </Header.Subheader>
            </Header>
          </div>
      );
    }

    const sortBy = [
      { key: 'teams', text: 'teams', value: 'teams' },
      { key: 'challenges', text: 'challenges', value: 'challenges' },
      { key: 'skills', text: 'skills', value: 'skills' },
      { key: 'tools', text: 'tools', value: 'tools' },
    ];

    const sticky = {
      position: '-webkit-sticky',
      position: 'sticky',
      top: '6.5rem',
    };

    const filters = new TeamFinderFilter();

    const setFilters = () => {
      const searchResults = filters.filterBySearch(this.props.teams, this.state.search);
      const skillResults = filters.filterBySkills(this.state.skills, this.props.skills, this.props.teamSkills, searchResults);
      const toolResults = filters.filterByTools(this.state.tools, this.props.tools, this.props.teamTools, skillResults);
      const challengeResults = filters.filterByChallenge(this.state.challenges, this.props.challenges, this.props.teamChallenges, toolResults);
      const sorted = filters.sortBy(challengeResults, 'teams');
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
      // this.setState({ search: event.target.value });
      // setFilters();
    };

    // const getSort = (event, { value }) => {
    //   this.setState({
    //     sortBy: value,
    //   }, () => {
    //     setFilters();
    //   });
    // };

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

    const universalSkills = this.props.skills;

    function getTeamSkills(teamID, teamSkills) {
      const data = [];
      const skills = _.filter(teamSkills, { teamID: teamID });
      for (let i = 0; i < skills.length; i++) {
        for (let j = 0; j < universalSkills.length; j++) {
          if (skills[i].skillID === universalSkills[j]._id) {
            data.push(universalSkills[j].name);
          }
        }
      }
      return data;
    }

    const universalTools = this.props.tools;

    function getTeamTools(teamID, teamTools) {
      const data = [];
      const tools = _.filter(teamTools, { teamID: teamID });
      for (let i = 0; i < tools.length; i++) {
        for (let j = 0; j < universalTools.length; j++) {
          if (tools[i].toolID === universalTools[j]._id) {
            data.push(universalTools[j].name);
          }
        }
      }
      return data;
    }

    const universalChallenges = this.props.challenges;

    function getTeamChallenges(teamID, teamChallenges) {
      const data = [];
      const challenges = _.filter(teamChallenges, { teamID: teamID });
      for (let i = 0; i < challenges.length; i++) {
        for (let j = 0; j < universalChallenges.length; j++) {
          if (challenges[i].challengeID === universalChallenges[j]._id) {
            data.push(universalChallenges[j].title);
          }
        }
      }
      return data;
    }

    const allDevelopers = this.props.developers;

    function getTeamDevelopers(teamID, teamDevelopers) {
      const data = [];
      const developers = _.filter(teamDevelopers, { teamID: teamID });
      for (let i = 0; i < developers.length; i++) {
        for (let j = 0; j < allDevelopers.length; j++) {
          if (developers[i].developerID === allDevelopers[j]._id) {
            data.push({
              firstName: allDevelopers[j].firstName,
              lastName: allDevelopers[j].lastName,
            });
          }
        }
      }
      return data;
    }

    return (
        <Grid container doubling relaxed stackable>
          <Grid.Row centered>
            <Header as={'h2'} style={{ paddingTop: '2rem' }}>
              Team Finder
            </Header>
          </Grid.Row>
          <Grid.Column width={4}>
            <Segment style={sticky}>
              <div style={{ paddingTop: '2rem' }}>
                <Header>
                  <Header.Content>
                    Total Teams: {this.state.result.length}
                  </Header.Content>
                </Header>
              </div>
              {/*<div style={{ paddingTop: '2rem' }}>*/}
              {/*  <Header>*/}
              {/*    <Header.Content>*/}
              {/*      Sort by {' '}*/}
              {/*      <Dropdown*/}
              {/*          inline*/}
              {/*          header='Sort by...'*/}
              {/*          options={sortBy}*/}
              {/*          defaultValue={sortBy[0].value}*/}
              {/*          onChange={getSort}*/}
              {/*      />*/}
              {/*    </Header.Content>*/}
              {/*  </Header>*/}
              {/*</div>*/}
              <div style={{ paddingTop: '2rem' }}>
                <Input icon='search'
                       iconPosition='left'
                       placeholder='Search by team name...'
                       onChange={handleSearchChange}
                       fluid
                />

                <div style={{ paddingTop: '2rem' }}>
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
              <div style={{ paddingTop: '2rem' }}>
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

              <div style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
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
              {this.state.result.map((teams) => <TeamFinderCard key={teams._id} teams={teams}
                                                                skills={getTeamSkills(teams._id, this.props.teamSkills)}
                                                                tools={getTeamTools(teams._id, this.props.teamTools)}
                                                                challenges={getTeamChallenges(teams._id, this.props.teamChallenges)}
                                                                developers={getTeamDevelopers(teams._id, this.props.teamDevelopers)}
              />)}
            </Item.Group>
          </Grid.Column>
        </Grid>
    );
  }
}

TeamFinder.propTypes = {
  teamChallenges: PropTypes.array.isRequired,
  teamSkills: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  teamTools: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  developers: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  teamDevelopers: PropTypes.array.isRequired,

};

export default withTracker(() => {
  const subscriptionChallenges = TeamChallenges.subscribe();
  const subscriptionSkills = TeamSkills.subscribe();
  const subscriptionTools = TeamTools.subscribe();
  const subscriptionDevelopers = Developers.subscribe();
  const subscriptionTeam = Teams.subscribe();
  const subSkills = Skills.subscribe();
  const subChallenges = Challenges.subscribe();
  const subTools = Tools.subscribe();
  const teamDev = TeamDevelopers.subscribe();

  return {
    teamChallenges: TeamChallenges.find({}).fetch(),
    teamSkills: TeamSkills.find({}).fetch(),
    teamTools: TeamTools.find({}).fetch(),
    teams: Teams.find({ open: true }).fetch(),
    skills: Skills.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    developers: Developers.find({}).fetch(),
    teamDevelopers: TeamDevelopers.find({}).fetch(),
    // eslint-disable-next-line max-len
    ready: subscriptionChallenges.ready() && subscriptionSkills.ready() && subscriptionTools.ready()
        && subscriptionDevelopers.ready() && subscriptionTeam.ready() && subSkills.ready() && subTools.ready()
        && subChallenges.ready() && teamDev.ready(),
  };
})(TeamFinder);
