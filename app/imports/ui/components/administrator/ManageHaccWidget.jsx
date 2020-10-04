import React from 'react';
import { Grid, Segment, Header, Table, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ChallengeInterests } from '../../../api/challenge/ChallengeInterestCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { ROUTES } from '../../../startup/client/route-constants';
import SkillsAdminWidget from './SkillsAdminWidget';
import ChallengesAdminWidget from './ChallengesAdminWidget';
import ToolsAdminWidget from './ToolsAdminWidget';

/**
 * Renders the Page for Managing HACC. **deprecated**
 * @memberOf ui/pages
 */
class ManageHaccWidget extends React.Component {

  render() {
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
                <Table fixed columns={5}>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell width={2}>Title</Table.HeaderCell>
                      <Table.HeaderCell width={5}>Description</Table.HeaderCell>
                      <Table.HeaderCell width={5}>Interests</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Submission Detail</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Pitch</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Edit</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Delete</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  {/* eslint-disable-next-line max-len */}
                  <Table.Body>{this.props.challenges.map((challenges => <ChallengesAdminWidget key={challenges._id} challenges={challenges} />
                  ))}
                  </Table.Body>
                </Table>
                <div align='center'>
                  <Button style={{
                    color: 'white', backgroundColor: '#24252B',
                    margin: '2rem 0rem',
                  }}><Link to={ROUTES.ADD_CHALLENGE} style={{ color: 'white' }}>Add Challenge</Link></Button>
                </div>
                <Header as="h2" textAlign="center" inverted>Skills</Header>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Edit</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Delete</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  {/* eslint-disable-next-line max-len */}
                  <Table.Body>{this.props.skills.map((skills => <SkillsAdminWidget key={skills._id} skills={skills} />))}
                  </Table.Body>
                </Table>
                <div align='center'>
                  <Button style={{
                    color: 'white', backgroundColor: '#24252B',
                    margin: '2rem 0rem',
                  }}><Link to={ROUTES.ADD_SKILL} style={{ color: 'white' }}>Add Skill</Link></Button>
                </div>
                <Header as="h2" textAlign="center" inverted>Tools</Header>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Edit</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Delete</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>{this.props.tools.map((tools => <ToolsAdminWidget key={tools._id} tools={tools} />))}
                  </Table.Body>
                </Table>
                <div align='center'>
                  <Button style={{
                    color: 'white', backgroundColor: '#24252B',
                    margin: '2rem 0rem',
                  }}><Link to={ROUTES.ADD_TOOL} style={{ color: 'white' }}>Add Tool</Link></Button>
                </div>
              </Segment>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

ManageHaccWidget.propTypes = {
  challenges: PropTypes.array.isRequired,
  challengeInterests: PropTypes.array.isRequired,
  interests: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => (
  {
    challenges: Challenges.find({}).fetch(),
    challengeInterests: ChallengeInterests.find({}).fetch(),
    interests: Interests.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
  }
))(ManageHaccWidget);
