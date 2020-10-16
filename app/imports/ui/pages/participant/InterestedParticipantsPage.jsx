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
// import InterestedParticipantsWidget1 from '../../components/participant/InterestedParticipantsWidget1';
// import InterestedParticipantsWidget from '../../components/participant/InterestedParticipantsWidget';

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
    console.log('Participants')
    console.log(Participants.find({}).fetch());
    console.log('Interests')
    console.log(Interests.find({}).fetch());
    console.log('tools')
    console.log(Tools.find({}).fetch());
    console.log('result')
    console.log(this.state.result)

    // eslint-disable-next-line no-unused-vars
    // const sortBy = [
    //   { key: 'teams', text: 'teams', value: 'teams' },
    //   { key: 'challenges', text: 'challenges', value: 'challenges' },
    //   { key: 'skills', text: 'skills', value: 'skills' },
    //   { key: 'tools', text: 'tools', value: 'tools' },
    //   { key: 'interests', text: 'interests', value: 'interests' },
    // ];






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

    return (
      <h1>{this.props.teamDoc.name}</h1>
    );
  }
}

InterestedParticipantsPage.propTypes = {
  teamDoc: PropTypes.object.isRequired,
};

const InterestedParticipantsContainer = withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;

  return {
    teamDoc: Teams.findOne(documentId),
  };
})(InterestedParticipantsPage);

export default withRouter(InterestedParticipantsContainer);