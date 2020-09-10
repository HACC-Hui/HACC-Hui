import React from 'react';
import { Container, Header, Loader, Button, Icon, Image, Item, Label } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Challenges } from '../challenge/ChallengeCollection';
import { ChallengeInterests } from '../challenge/ChallengeInterestCollection';
import { TeamChallenges } from '../team/TeamChallengeCollection';
import { DeveloperChallenges } from '../user/DeveloperChallengeCollection';

import ItemAdmin from '../components/ItemAdmin';


/**
 *
 * Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row.
 * @memberOf ui/pages
 */
class ListChallengesAdmin extends React.Component {


  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  /** Render the page once challenges have been received. */
  render() {

    const {challenges, ready, challengeInterest} = this.props;


    // console.log(challengeInterest);

    return (!ready) ? <Loader active>Getting data</Loader>: (
      <Container>
        <Header as="h2" textAlign="center">List Challenges (Admin)</Header>
        {challenges.map((challenge) => <ItemAdmin key={challenge._id} challenge={challenge} />)}

      </Container>
    );
  }
}

// Require an array of all of the collections in the props.
ListChallengesAdmin.propTypes = {
  challenges: PropTypes.isRequired,
  challengeInterest: PropTypes.isRequired,
  developerChallenge: PropTypes.isRequired,
  teamChallenge: PropTypes.isRequired,

  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to documents.
  console.log(Challenges);
  console.log(ChallengeInterest);

  const subChallengeInterest = ChallengeInterest.subscribe();
  const subDeveloperChallenge = DeveloperChallenge.subscribe();
  const subTeamChallenge = TeamChallenge.subscribe();
  const subChallenges = Challenges.subscribe();

  return {
    challenges: Challenges.find({}).fetch(),
    challengeInterest: ChallengeInterest.find({}).fetch(),
    developerChallenge: DeveloperChallenge.find({}).fetch(),
    teamChallenge: TeamChallenge.find({}).fetch(),

    ready: subChallenges.ready() && subChallengeInterest.ready() && subDeveloperChallenge.ready() && subTeamChallenge.ready(),
  };
})(ListChallengesAdmin);
