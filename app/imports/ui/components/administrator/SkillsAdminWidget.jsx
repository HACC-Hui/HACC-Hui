import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Skills } from '../../../api/skill/SkillCollection';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
const SkillsAdminWidget = (props) => {
  const [skillData, setSkillData] = useState(props.skills);

  useEffect(() => {
    setSkillData(props.skills);
  }, [props.skills]);
  const removeItem = (docID) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this skill!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          if (willDelete) {
            removeItMethod.call({
              collectionName: Skills.getCollectionName(),
              instance: Skills.getID(docID),
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Skill removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  }

    return (
        <tr>
          <th>{skillData.name}</th>
          <th>{skillData.description}</th>
          {/* eslint-disable-next-line max-len */}
          <th width={2}><Button variant="light"><Link to={`/edit-skill/${skillData._id}`} style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Edit</Link></Button></th>
          {/* eslint-disable-next-line max-len */}
          <th width={2}><Button variant="danger" negative='true' onClick={() => removeItem(skillData._id)}>Delete</Button></th>
        </tr>
    );
}

/** Require a document to be passed to this component. */
SkillsAdminWidget.propTypes = {
  skills: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */

export default withRouter(SkillsAdminWidget);
