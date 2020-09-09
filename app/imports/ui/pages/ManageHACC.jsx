import React from 'react';
import { Grid, Segment, Header, Table, Button, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { Skills } from '../../api/skill/SkillCollection';
import { Tools } from '../../api/tool/ToolCollection';
import ChallengeAdminTable from '../components/ChallengeAdminTable';
import SkillAdminTable from '../components/SkillAdminTable';
import ToolAdminTable from '../components/ToolAdminTable';

/**
 * Renders the Page for Managing HACC. **deprecated**
 * @memberOf ui/pages
 */
class ManageHACC extends React.Component {

  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    return (
        <div style={{ backgroundColor: '#C4C4C4', paddingBottom: '50px' }}>
          <Grid container centered>
            <Grid.Column>
              <div style={{
                backgroundColor: '#393B44', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem',
              }}>
                <Header as="h2" textAlign="center" inverted>Manage HACC</Header>
              </div>
              <Segment style={{
                borderRadius: '1rem',
                backgroundColor: '#393B44',
              }} className={'teamCreate'}>
                <Header as="h2" textAlign="center" inverted>Challenges</Header>
                <Table>
                  <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Title</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Interests</Table.HeaderCell>
                    <Table.HeaderCell>Submission Detail</Table.HeaderCell>
                    <Table.HeaderCell>Pitch</Table.HeaderCell>
                  </Table.Row>
                  </Table.Header>
                  {/* eslint-disable-next-line max-len */}
                  <Table.Body>{this.props.challenges.map((challenges => <ChallengeAdminTable key={challenges._id} challenges={challenges} />))}
                      </Table.Body>
                </Table>
                <div align='center'>
                <Button style={{
                  color: 'white', backgroundColor: '#24252B',
                  margin: '2rem 0rem',
                }}><Link to={'/add-challenge/'} style={{ color: 'white' }}>Add Challenge</Link></Button>
                </div>
                <Header as="h2" textAlign="center" inverted>Skills</Header>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  {/* eslint-disable-next-line max-len */}
                  <Table.Body>{this.props.skills.map((skills => <SkillAdminTable key={skills._id} skills={skills} />))}
                  </Table.Body>
                </Table>
                <div align='center'>
                <Button style={{
                  color: 'white', backgroundColor: '#24252B',
                  margin: '2rem 0rem',
                }}><Link to={'/add-skill/'} style={{ color: 'white' }}>Add Skill</Link></Button>
                </div>
                <Header as="h2" textAlign="center" inverted>Tools</Header>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>{this.props.tools.map((tools => <ToolAdminTable key={tools._id} tools={tools} />))}
                  </Table.Body>
                </Table>
                <div align='center'>
                <Button style={{
                  color: 'white', backgroundColor: '#24252B',
                  margin: '2rem 0rem',
                }}><Link to={'/add-tool/'} style={{ color: 'white' }}>Add Tool</Link></Button>
                </div>
              </Segment>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

ManageHACC.propTypes = {
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Challenges.subscribe();
  const subscription2 = Skills.subscribe();
  const subscription3 = Tools.subscribe();
  return {
    challenges: Challenges.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    ready: subscription.ready() && subscription2.ready() && subscription3.ready(),
  };
})(ManageHACC);
