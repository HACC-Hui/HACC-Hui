import React from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import ListMinorWidget from './ListMinorWidget';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';

/**
 * Renders the Page for Managing HACC. **deprecated**
 * @memberOf ui/pages
 */
const ManageMinorWidget = () => {
    return (
        <div style={{ backgroundColor: '#C4C4C4', paddingBottom: '50px' }}>
          <Container centered>
            <Col>
              <div style={{
                textAlign: 'center',
                backgroundColor: '#393B44', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem',
              }}>
                <h2>Minor Participant</h2>
                <h2>{this.props.minorParticipants.length}</h2>
              </div>
              <Container style={{
                textAlign: 'center',
                borderRadius: '1rem',
                backgroundColor: '#393B44',
              }} className={'teamCreate'}>
                <h2>Information</h2>
                <Table fixed columns={5}>
                  <thead>
                    <tr>
                      <th width={2}>Username</th>
                      <th width={5}>Parent/Guardian:FirstName</th>
                      <th width={5}>Parent/Guardian:LastName</th>
                      <th width={5}>Parent/Guardian:Email</th>
                      <th width={2}>Approve</th>
                      <th width={2}>Delete</th>
                    </tr>
                  </thead>
                  {/* eslint-disable-next-line max-len */}
                  <tbody>{this.props.minorParticipants.map((minorParticipants => <ListMinorWidget key={minorParticipants._id} minorParticipants={minorParticipants} />
                  ))}
                  </tbody>
                </Table>
              </Container>
            </Col>
          </Container>
        </div>
    );
}

ManageMinorWidget.propTypes = {
  minorParticipants: PropTypes.array.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const mps = MinorParticipants.find({}).fetch();
  const minorParticipants = [];
  mps.forEach((m) => {
    const result = m;
    result.username = Participants.findDoc(m.participantID).username;
    minorParticipants.push(result);
  });
  console.log(minorParticipants);
  return {
    minorParticipants,
  };
})(ManageMinorWidget);
