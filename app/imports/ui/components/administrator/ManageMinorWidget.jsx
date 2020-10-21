import React from 'react';
import { Grid, Segment, Header, Table, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ROUTES } from '../../../startup/client/route-constants';
import ListMinorWidget from './ListMinorWidget';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';

/**
 * Renders the Page for Managing HACC. **deprecated**
 * @memberOf ui/pages
 */
class ManageMinorWidget extends React.Component {

  render() {
    return (
        <div style={{ backgroundColor: '#C4C4C4', paddingBottom: '50px' }}>
          <Grid container centered>
            <Grid.Column>
              <div style={{
                backgroundColor: '#393B44', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem',
              }}>
                <Header as="h2" textAlign="center" inverted>Minor Participant</Header>
              </div>
              <Segment style={{
                borderRadius: '1rem',
                backgroundColor: '#393B44',
              }} className={'teamCreate'}>
                <Header as="h2" textAlign="center" inverted>Information</Header>
                <Table fixed columns={5}>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell width={2}>Username</Table.HeaderCell>
                      <Table.HeaderCell width={5}>Parent/Guardian:FirstName</Table.HeaderCell>
                      <Table.HeaderCell width={5}>Parent/Guardian:LastName</Table.HeaderCell>
                      <Table.HeaderCell width={5}>Parent/Guardian:Email</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Approve</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Delete</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  {/* eslint-disable-next-line max-len */}
                  <Table.Body>{this.props.minorParticipants.map((minorParticipants => <ListMinorWidget key={minorParticipants._id} minorParticipants={minorParticipants} />
                  ))}
                  </Table.Body>
                </Table>
              </Segment>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

ManageMinorWidget.propTypes = {
  minorParticipants: PropTypes.array.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => (
  {
    minorParticipants: MinorParticipants.find({}).fetch(),
  }
))(ManageMinorWidget);
