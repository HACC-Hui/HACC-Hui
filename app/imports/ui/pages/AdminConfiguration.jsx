import React from 'react';
import { Container, Table, Loader, Button, Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { ChallengeInterests } from '../../api/challenge/ChallengeInterestCollection';
import { Interests } from '../../api/interest/InterestCollection';
import { Skills } from '../../api/skill/SkillCollection';
import { Tools } from '../../api/tool/ToolCollection';
import ChallengesAdmin from '../components/ChallengesAdmin';
import SkillsAdmin from '../components/SkillsAdmin';
import ToolsAdmin from '../components/ToolsAdmin';

/**
 * **Deprecated**
 *
 * Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row.
 * @memberOf ui/pages
 */
class AdminConfiguration extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const tableStyle = {
      position: 'sticky',
      borderType: 'solid',
      borderTop: '2px',
      borderBottom: '2px',
      borderRight: '2px',

    }

    return (
        <div style={{paddingLeft:'5%', paddingRight:'5%', }}>
          <div style={{ display: 'flex', flexDirection: 'row', margin: 15, justifyContent: 'center', alignItems: 'stretch' }}>
            <b style={{ fontSize: 30 }}>Challenges</b>
          </div>
          <div style = {{overflow: 'auto', height: '500px',}}>
          <Table celled style={tableStyle}>
            <Table.Header>
              <Table.Row style={{borderCollapse: 'separate'}}>
                <Table.HeaderCell style={{backgroundColor: '#E5F0FE', position: 'sticky', top:'0', fontSize: 15,}}>Title</Table.HeaderCell>
                <Table.HeaderCell style={{backgroundColor: '#E5F0FE', position: 'sticky', top:'0', fontSize: 15,}}>Description</Table.HeaderCell>
                <Table.HeaderCell style={{backgroundColor: '#E5F0FE', position: 'sticky', top:'0', fontSize: 15,}}>Interests</Table.HeaderCell>
                <Table.HeaderCell style={{backgroundColor: '#E5F0FE', position: 'sticky', top:'0', fontSize: 15,}}>Submission Detail</Table.HeaderCell>
                <Table.HeaderCell style={{backgroundColor: '#E5F0FE', position: 'sticky', top:'0', fontSize: 15,}}>Pitch</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.challenges.map((challenge) => {
                const interestsArray = this.props.challengeInterests;
                console.log(this.props.challenges);
                const chosenInterestArray = interestsArray.filter((item) => item.challengeID === Challenges.getID(challenge.slugID));
                const challengeInterest = this.props.interests.filter((item) => item._id === chosenInterestArray[0].interestID)[0].name;
                return <ChallengesAdmin key={challenge._id} challenge={challenge} interest={ challengeInterest }/>;
              })}
            </Table.Body>
          </Table>
          </div>

          <Grid style={{ flexDirection: 'row', margin: 15, justifyContent: 'center', alignItems: 'stretch' }}>
            <b style={{ fontSize: 25 }}>Skills</b>
          </Grid>
          <div style = {{overflow: 'auto', height: '300px',}}>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{backgroundColor: '#E5F0FE', position: 'sticky', top:'0', fontSize: 15,}}>Name</Table.HeaderCell>
                <Table.HeaderCell style={{backgroundColor: '#E5F0FE', position: 'sticky', top:'0', fontSize: 15,}}>Description</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.skills.map((skill) => <SkillsAdmin key={skill._id} skill={skill} />)}
            </Table.Body>
          </Table>
          </div>

          <Grid style={{ flexDirection: 'row', margin: 15, justifyContent: 'center', alignItems: 'stretch' }}>
            <b style={{ fontSize: 25 }}>Tools</b>
          </Grid>
          <div style = {{overflow: 'auto', height: '300px',}}>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{backgroundColor: '#E5F0FE', position: 'sticky', top:'0', fontSize: 15,}}>Name</Table.HeaderCell>
                <Table.HeaderCell style={{backgroundColor: '#E5F0FE', position: 'sticky', top:'0', fontSize: 15,}}>Description</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.tools.map((tool) => <ToolsAdmin key={tool._id} tool={tool} />)}
            </Table.Body>
          </Table>
          </div>

        </div>
    );
  }
}
// Require an array of Stuff documents in the props.
AdminConfiguration.propTypes = {
  challenges: PropTypes.array.isRequired,
  challengeInterests: PropTypes.array.isRequired,
  interests: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};
// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Challenges.subscribe();
  return {
    challenges: Challenges.find({}).fetch(),
    challengeInterests: ChallengeInterests.find({}).fetch(),
    interests: Interests.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    ready: subscription.ready(),
  };
})(AdminConfiguration);