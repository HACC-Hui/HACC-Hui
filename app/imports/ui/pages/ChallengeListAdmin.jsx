import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Button, Icon, Image, Item, Label } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import { ChallengeInterests } from '../../api/challenge/ChallengeInterestCollection';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { TeamChallenges } from '../../api/team/TeamChallengeCollection';
import { DeveloperChallenges } from '../../api/user/DeveloperChallengeCollection';
import { Interests } from '../../api/interest/InterestCollection';
import { Developers } from '../../api/user/DeveloperCollection';
import { Teams } from '../../api/team/TeamCollection';
import ItemAdmin from '../components/ItemAdmin';


/**
 *
 * Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row.
 * @memberOf ui/pages
 */
class ChallengeListAdmin extends React.Component {

  specialFind(value, property, collectionSource, collectionTarget) {
    // console.log(collectionSource)
    if(typeof collectionSource === 'undefined' || typeof collectionTarget === 'undefined'
        || collectionSource.length === 0 || collectionTarget.length === 0
      ) {return []; }
    if (collectionSource[0].hasOwnProperty(property)) {
      let res = collectionSource.filter(doc => doc[property] === value);
      res = res.map((doc) => collectionTarget.findDoc(doc.interestID));
      return res;
    } else {
      console.log(`The objects in the '${collectionSource}' does not have the '${property}' property`)
    }
  }

  componentDidMount() {
    const {challenges, challengeInterests, developerChallenges, teamChallenges} = this.props;

    // console.log('challenges');
    // console.log(challenges);
    // console.log('challengeInterests');
    // console.log(challengeInterests);
    // console.log('developerChallenges');
    // console.log(developerChallenges);
    // console.log('teamChallenges');
    // console.log(teamChallenges);
    // console.log('filterByProperty');
  }


  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  /** Render the page once challenges have been received. */
  render() {

    const {challenges, ready, challengeInterests, developerChallenges, teamChallenges} = this.props;

    return (!ready) ? <Loader active>Getting data</Loader>: (
      <Container>
        <Header as="h2" textAlign="center">List Challenges (Admin)</Header>
        <Button color="green" floated='right' as={NavLink} activeClassName="active" exact to="/add" key='admin'>
          <Icon name='add' />
          Add
        </Button>
        <Item.Group divided>
          {challenges.map((challenge) => (
            <ItemAdmin key={challenge._id} 
                        challenge={challenge} 
                        challengeInterests={this.specialFind(challenge._id, 'challengeID', challengeInterests, Interests)}
                        challengeDevelopers={this.specialFind(challenge._id, 'challengeID', developerChallenges, Developers)}
                        challengeTeams={this.specialFind(challenge._id, 'challengeID', teamChallenges, Teams)}
            />)
          )}
        </Item.Group>

      </Container>
    );
  }
}

// Require an array of all of the collections in the props.
ChallengeListAdmin.propTypes = {
  challenges: PropTypes.array.isRequired,
  challengeInterests: PropTypes.array.isRequired,
  developerChallenges: PropTypes.array.isRequired,
  teamChallenges: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
const ChallengeListAdminContainer = withTracker(() => {
  // Get access to documents.
  const subChallengeInterest = ChallengeInterests.subscribe();
  const subDeveloperChallenge = DeveloperChallenges.subscribe();
  const subTeamChallenge = TeamChallenges.subscribe();
  const subChallenges = Challenges.subscribe();

  return {
    challenges: Challenges.find({}).fetch(),
    challengeInterests: ChallengeInterests.find({}).fetch(),
    developerChallenges: DeveloperChallenges.find({}).fetch(),
    teamChallenges: TeamChallenges.find({}).fetch(),

    ready: subChallenges.ready() && subChallengeInterest.ready() && subDeveloperChallenge.ready() && subTeamChallenge.ready(),
  };
})(ChallengeListAdmin);

// Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(ChallengeListAdminContainer);