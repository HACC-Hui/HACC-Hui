import React from 'react';
import { Button, Table, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ChallengeInterests } from '../../../api/challenge/ChallengeInterestCollection';
import { Interests } from '../../../api/interest/InterestCollection';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
class ChallengesAdminWidget extends React.Component {
  removeItem(docID) {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this challenge!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          if (willDelete) {
            removeItMethod.call({
              collectionName: Challenges.getCollectionName(),
              instance: Challenges.getID(docID),
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Challenge removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  }

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
    // console.log(this.props.challenges);
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
          <Table.Cell width={2}>{this.props.challenges.title}</Table.Cell>
          <Table.Cell width={5}>{this.props.challenges.description}</Table.Cell>
          <Table.Cell width={5}>
            {challengeInterestArray.map((interest) => (
                <Label circular key={interest} style={{ background: '#545fa1', color: 'white' }}>
                  {interest}
                </Label>
            ))}
          </Table.Cell>
          <Table.Cell width={2}>{this.props.challenges.submissionDetail}</Table.Cell>
          <Table.Cell width={2}>{this.props.challenges.pitch}</Table.Cell>
          {/* eslint-disable-next-line max-len */}
          <Table.Cell width={2}><Button><Link to={`/edit-challenge/${this.props.challenges._id}`} style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Edit</Link></Button></Table.Cell>
          {/* eslint-disable-next-line max-len */}
          <Table.Cell width={2}><Button negative onClick={() => this.removeItem(this.props.challenges._id)}>Delete</Button></Table.Cell>
        </Table.Row>
    );
  }
}

/** Require a document to be passed to this component. */
ChallengesAdminWidget.propTypes = {
  challenges: PropTypes.object.isRequired,
  interests: PropTypes.array.isRequired,
  matchInterests: PropTypes.array.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */

export default withTracker(() => (
  {
    interests: ChallengeInterests.find({}).fetch(),
    matchInterests: Interests.find({}).fetch(),
  }
))(ChallengesAdminWidget);
