import React from 'react';
import { Table, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ChallengeInterests } from '../../api/challenge/ChallengeInterestCollection';
import { Interests } from '../../api/interest/InterestCollection';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
class ChallengeAdminTable extends React.Component {

  filterInterests = (interest) => {
    const interestArray = this.props.interests.slice().filter((item) => item.challengeID === this.props.challenges._id);
    for (let i = 0; i < interestArray.length; i++) {
      if (interest._id === interestArray[i].interestID) {
        return true;
      }
    }
    return false;
  }

  findInterests() {
    console.log(this.props.challenges);
    // console.log(this.props.matchInterests.filter(this.filterInterests));
    const challengeInterestArray = this.props.matchInterests.filter(this.filterInterests);
    const finalInterests = challengeInterestArray.map(a => a.name);
   // console.log(finalInterests);
    return finalInterests;
  }

  render() {
    const challengeInterestArray = this.findInterests();
    // console.log(challengeInterestArray);
    return (
        <Table.Row>
          <Table.Cell>{this.props.challenges.title}</Table.Cell>
          <Table.Cell>{this.props.challenges.description}</Table.Cell>
          {challengeInterestArray.map((interest) => (
              <Label circular key={interest} style={{ background: '#53a78e', color: 'white' }}>
                {interest}
              </Label>
          ))}
          <Table.Cell>{this.props.challenges.submissionDetail}</Table.Cell>
          <Table.Cell>{this.props.challenges.pitch}</Table.Cell>
        </Table.Row>
    );
  }
}

/** Require a document to be passed to this component. */
ChallengeAdminTable.propTypes = {
  challenges: PropTypes.object.isRequired,
  interests: PropTypes.array.isRequired,
  matchInterests: PropTypes.array.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */

export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = ChallengeInterests.subscribe();
  return {
    interests: ChallengeInterests.find({}).fetch(),
    matchInterests: Interests.find({}).fetch(),
    ready: subscription.ready(),
  };
})(ChallengeAdminTable);
