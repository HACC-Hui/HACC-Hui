import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
const ChallengesAdminWidget = (props) => {
  const [challengesData, setChallengeData] = useState(props.challenges);

  useEffect(() => {
  setChallengeData(props.challenges);
  }, [props.challenges]);
  const removeItem = (docID) => {
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

    return (
        <tr>
          <th width={2}>{challengesData.title}</th>
          <th width={5}>{challengesData.description}</th>
          <th width={2}>{challengesData.submissionDetail}</th>
          <th width={2}>{challengesData.pitch}</th>
          {/* eslint-disable-next-line max-len */}
          <th width={2}><Button variant="light"><Link to={`/edit-challenge/${challengesData._id}`} style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Edit</Link></Button></th>
          {/* eslint-disable-next-line max-len */}
          <th width={2}><Button variant="danger" negative onClick={() => removeItem(challengesData._id)}>Delete</Button></th>
        </tr>
    );
}

/** Require a document to be passed to this component. */
ChallengesAdminWidget.propTypes = {
  challenges: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */

export default ChallengesAdminWidget;
