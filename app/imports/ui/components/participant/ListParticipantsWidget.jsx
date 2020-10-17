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
import ListParticipantsCard from './ListParticipantsCard';
import ListParticipantsFilter from './ListParticipantsFilter';

class ListParticipantsWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      challenges: [],
      tools: [],
      skills: [],
      result: _.orderBy(this.props.developers, ['name'], ['asc']),
    };
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  /*
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }
  */

  render() {

    if (this.props.developers.length === 0) {
      return (
          <div align={'center'}>
            <Header as='h2' icon>
              <Icon name='users'/>
              There are no participants at the moment.
              <Header.Subheader>
                Please check back later.
              </Header.Subheader>
            </Header>
          </div>
      );
    }

    // eslint-disable-next-line no-unused-vars
    const sortBy = [
      { key: 'teams', text: 'teams', value: 'teams' },
      { key: 'challenges', text: 'challenges', value: 'challenges' },
      { key: 'skills', text: 'skills', value: 'skills' },
      { key: 'tools', text: 'tools', value: 'tools' },
    ];

    const sticky = {
      position: '-webkit-sticky',
      // eslint-disable-next-line no-dupe-keys
      position: 'sticky',
      top: '6.5rem',
    };

    const filters = new ListParticipantsFilter();

    const setFilters = () => {
      const searchResults = filters.filterBySearch(this.props.developers, this.state.search);
      // eslint-disable-next-line max-len
      const skillResults = filters.filterBySkills(this.state.skills, this.props.skills, this.props.developerSkills, searchResults);
      // eslint-disable-next-line max-len
      const toolResults = filters.filterByTools(this.state.tools, this.props.tools, this.props.developerTools, skillResults);
      // eslint-disable-next-line max-len
      const challengeResults = filters.filterByChallenge(this.state.challenges, this.props.challenges, this.props.developerChallenges, toolResults);
      const sorted = filters.sortBy(challengeResults, 'devs');
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

    function getDeveloperSkills(developerID, developerSkills) {
      const data = [];
      const skills = _.filter(developerSkills, { participantID: developerID });
      for (let i = 0; i < skills.length; i++) {
        for (let j = 0; j < universalSkills.length; j++) {
          if (skills[i].skillID === universalSkills[j]._id) {
            data.push({ name: universalSkills[j].name });
          }
        }
      }
      console.log(data);
      return data;
    }

    const universalTools = this.props.tools;

    function getDeveloperTools(developerID, developerTools) {
      const data = [];
      const tools = _.filter(developerTools, { participantID: developerID });
      for (let i = 0; i < tools.length; i++) {
        for (let j = 0; j < universalTools.length; j++) {
          if (tools[i].toolID === universalTools[j]._id) {
            data.push({ name: universalTools[j].name });
          }
        }
      }
      console.log(data);
      return data;
    }

    const universalChallenges = this.props.challenges;

    function getDeveloperChallenges(developerID, developerChallenges) {
      const data = [];
      const challenges = _.filter(developerChallenges, { participantID: developerID });
      for (let i = 0; i < challenges.length; i++) {
        for (let j = 0; j < universalChallenges.length; j++) {
          if (challenges[i].challengeID === universalChallenges[j]._id) {
            data.push(universalChallenges[j].title);
          }
        }
      }
      return data;
    }

    return (
        <Grid container doubling relaxed stackable>
          <Grid.Row centered>
            <Header as={'h2'} style={{ paddingTop: '2rem' }}>
              All Developers
            </Header>
          </Grid.Row>
          <Grid.Column width={4}>
            <Segment style={sticky}>
              <div style={{ paddingTop: '2rem' }}>
                <Header>
                  <Header.Content>
                    Total Developers: {this.state.result.length}
                  </Header.Content>
                </Header>
              </div>
              {/* <div style={{ paddingTop: '2rem' }}> */}
              {/*  <Header> */}
              {/*    <Header.Content> */}
              {/*      Sort by {' '} */}
              {/*      <Dropdown */}
              {/*          inline */}
              {/*          header='Sort by...' */}
              {/*          options={sortBy} */}
              {/*          defaultValue={sortBy[0].value} */}
              {/*          onChange={getSort} */}
              {/*      /> */}
              {/*    </Header.Content> */}
              {/*  </Header> */}
              {/* </div> */}
              <div style={{ paddingTop: '2rem' }}>
                <Input icon='search'
                       iconPosition='left'
                       placeholder='Search by developer name...'
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
              {/* eslint-disable-next-line max-len */}
              {this.state.result.map((developers) => <ListParticipantsCard
                  key={developers._id}
                  devID={developers._id}
                  developers={developers}
                  skills={getDeveloperSkills(developers._id, this.props.developerSkills)}
                  tools={getDeveloperTools(developers._id, this.props.developerTools)}
                  challenges={getDeveloperChallenges(developers._id, this.props.developerChallenges)}
              />)}
            </Item.Group>
          </Grid.Column>
        </Grid>
    );
  }
}

ListParticipantsWidget.propTypes = {
  developerChallenges: PropTypes.array.isRequired,
  developerSkills: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  developerTools: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  developers: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  // ready: PropTypes.bool.isRequired,

};

export default withTracker(() =>
  /*
  const subscriptionChallenges = DeveloperChallenges.subscribe();
  const subscriptionSkills = DeveloperSkills.subscribe();
  const subscriptionTools = DeveloperTools.subscribe();
  const subscriptionDevelopers = Developers.subscribe();
  const subscriptionTeam = Teams.subscribe();
  const subSkills = Skills.subscribe();
  const subChallenges = Challenges.subscribe();
  const subTools = Tools.subscribe();
   */

    // eslint-disable-next-line implicit-arrow-linebreak
   ({
    developerChallenges: ParticipantChallenges.find({}).fetch(),
    developerSkills: ParticipantSkills.find({}).fetch(),
    developerTools: ParticipantTools.find({}).fetch(),
    teams: Teams.find({ open: true }).fetch(),
    skills: Skills.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    developers: Participants.find({}).fetch(),
    // eslint-disable-next-line max-len
    /*
    ready: subscriptionChallenges.ready() && subscriptionSkills.ready() && subscriptionTools.ready()
        && subscriptionDevelopers.ready() && subscriptionTeam.ready() && subSkills.ready() && subTools.ready()
        && subChallenges.ready(),
     */
  }))(ListParticipantsWidget);
