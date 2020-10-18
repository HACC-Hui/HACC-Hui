import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
// import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import { _ } from 'lodash';
import {
  Grid,
    Header,
    Item,
    Icon,
    Segment,
    Input,
    Dropdown,
} from 'semantic-ui-react';
import { Teams } from '../../../api/team/TeamCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { ParticipantInterests } from '../../../api/user/ParticipantInterestCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import ListParticipantsCard from '../../components/participant/ListParticipantsCard';
import ListParticipantsFilter from '../../components/participant/ListParticipantsFilter';
import InterestedParticipantsWidget from '../../components/participant/InterestedParticipantsWidget';
import { ToAcceptWantsToJoin } from '../../../api/team/ToAcceptWantToJoinCollection';

const getInterestedParticipants = (team) => {
  const teamID = team._id;
  const InterestedParticipants = ToAcceptWantsToJoin.find({ teamID }).fetch();
  const interestedParticipants = InterestedParticipants.map((wd) => Participants.findDoc(wd.participantID));
  return interestedParticipants;
};

class InterestedParticipantsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      challenges: [],
      tools: [],
      skills: [],
      interests: [],
      result: _.orderBy(Participants.find({}).fetch(), ['name'], ['asc']),
    };
  }

  render() {

    // eslint-disable-next-line no-unused-vars
    // const sortBy = [
    //   { key: 'teams', text: 'teams', value: 'teams' },
    //   { key: 'challenges', text: 'challenges', value: 'challenges' },
    //   { key: 'skills', text: 'skills', value: 'skills' },
    //   { key: 'tools', text: 'tools', value: 'tools' },
    //   { key: 'interests', text: 'interests', value: 'interests' },
    // ];

    const sticky = {
      position1: '-webkit-sticky',
      // eslint-disable-next-line no-dupe-keys
      position: 'sticky',
      top: '6.5rem',
    };

    const filters = new ListParticipantsFilter();

    const setFilters = () => {
      const searchResults = filters.filterBySearch(this.props.participants, this.state.search);
      // eslint-disable-next-line max-len
      const skillResults = filters.filterBySkills(this.state.skills, this.props.skills, this.props.participantSkills, searchResults);
      // eslint-disable-next-line max-len
      const toolResults = filters.filterByTools(this.state.tools, this.props.tools, this.props.participantTools, skillResults);
      // eslint-disable-next-line max-len
      const challengeResults = filters.filterByChallenge(this.state.challenges, this.props.challenges, this.props.participantChallenges, toolResults);
      // eslint-disable-next-line max-len
      // const interestResults = filters.filterByInterest(this.state.interests, this.props.interests, this.props.participantInterests, interestResults);
      const sorted = filters.sortBy(challengeResults, 'participants');
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

    const getInterest = (event, { value }) => {
      this.setState({
        interests: value,
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
      // console.log(data);
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

    const universalInterests = this.props.interests;

    function getParticipantInterests(participantID, participantInterests) {
      const data = [];
      const interests = _.filter(participantInterests, { participantID: participantID });
      for (let i = 0; i < interests.length; i++) {
        for (let j = 0; j < universalInterests.length; j++) {
          if (interests[i].challengeID === universalInterests[j]._id) {
            data.push(universalInterests[j].title);
          }
        }
      }
      return data;
    }

    if (this.props.participants.length === 0) {
      return (
          <div align={'center'}>
            <Header as='h2' icon>
              <Icon name='users'/>
              There are no participants interested in joining {this.props.teamDoc.name} at the moment.
              <Header.Subheader>
                Please check back later.
              </Header.Subheader>
            </Header>
          </div>
      );
    }

    return (
      <Grid container doubling relaxed stackable>
        <Grid.Row centered>
          <Header as={'h2'} style={{ paddingTop: '2rem' }}>
            Participants Interested in Joining {this.props.teamDoc.name}
          </Header>
        </Grid.Row>
        <Grid.Column width={4}>
          <Segment style={sticky}>
            <div style={{ paddingTop: '2rem' }}>
              <Header>
                <Header.Content>
                  Total Interested Participants: {this.state.result.length}
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
                      placeholder='Search by participants name...'
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
            <div style={{ paddingTop: '2rem' }}>
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
            {/* <div style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
              <Header>Interests</Header>
              <Dropdown
                  placeholder='Interests'
                  fluid
                  multiple
                  search
                  selection
                  options={filters.dropdownValues(this.props.interests, 'name')}
                  onChange={getInterest}
              />
            </div> */}
          </Segment>
        </Grid.Column>
        <Grid.Column width={12}>
          <Item.Group>
            {/* eslint-disable-next-line max-len */}
            {this.state.result.map((participants) => <InterestedParticipantsWidget
                key={participants._id}
                parID={participants._id}
                participants={participants}
                skills={getParticipantSkills(participants._id, this.props.participantSkills)}
                tools={getParticipantTools(participants._id, this.props.participantTools)}
                challenges={getParticipantChallenges(participants._id, this.props.participantChallenges)}
                interests={getParticipantInterests(participants._id, this.props.participantInterests)}
            />)}
          </Item.Group>
        </Grid.Column>
      </Grid>
    );
  }
}

InterestedParticipantsPage.propTypes = {
  teamDoc: PropTypes.object.isRequired,
  participantChallenges: PropTypes.array.isRequired,
  participantSkills: PropTypes.array.isRequired,
  participantInterests: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  participantTools: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  interests: PropTypes.array.isRequired,
};

const InterestedParticipantsContainer = withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const teamDoc = Teams.findOne(documentId);
  const participants = getInterestedParticipants(teamDoc);

  return {
    teamDoc,
    participants,
    participantChallenges: ParticipantChallenges.find({}).fetch(),
    participantSkills: ParticipantSkills.find({}).fetch(),
    participantTools: ParticipantTools.find({}).fetch(),
    participantInterests: ParticipantInterests.find({}).fetch(),
    teams: Teams.find({ open: true }).fetch(),
    skills: Skills.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    interests: Interests.find({}).fetch(),
  };
})(InterestedParticipantsPage);

export default withRouter(InterestedParticipantsContainer);