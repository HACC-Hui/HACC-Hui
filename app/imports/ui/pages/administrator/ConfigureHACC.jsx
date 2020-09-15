import React from 'react';
import { Table, Header, Loader, Grid, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Tools } from '../../../api/tool/ToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import ChallengesAdmin from '../../components/administrator/ChallengesAdmin';
import SkillsAdmin from '../../components/administrator/SkillsAdmin';
import ToolsAdmin from '../../components/administrator/ToolsAdmin';
import { ROUTES } from '../../../startup/client/route-constants';
// import { removeItMethod } from '../../api/base/BaseCollection.methods';
// import swal from 'sweetalert';

/**
 * **Deprecated**
 *
 * Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row.
 * @memberOf ui/pages
 */
class ConfigureHACC extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <div>
          <Header as="h1" textAlign="center">Configure the HACC</Header>
          <Grid divided>
            <Grid.Row>
              <Grid.Column width={10}>
                <Header as="h2" textAlign="center">Challenges</Header>

                <Grid>
                  <Grid.Column textAlign="center">
                    <Button as={NavLink} activeClassName="active" exact to={ROUTES.ADD_CHALLENGE} key='addChallenge'
                            size='large'>Add Challenge</Button>
                  </Grid.Column>
                </Grid>

                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Title</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                      <Table.HeaderCell>Submission Details</Table.HeaderCell>
                      <Table.HeaderCell>Pitch</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {this.props.challenges.map((challenges => <ChallengesAdmin key={challenges._id}
                                                                               challenges={challenges} />))}
                  </Table.Body>
                </Table>
              </Grid.Column>

              <Grid.Column width={3}>
                <Header as="h2" textAlign="center">Skills</Header>

                <Grid>
                  <Grid.Column textAlign="center">
                    <Button as={NavLink} activeClassName="active" exact to={ROUTES.ADD_SKILL} key='addSkill'
                            size='large'>Add
                      Skill</Button>
                  </Grid.Column>
                </Grid>

                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Skills</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {this.props.skills.map((skills => <SkillsAdmin key={skills._id} skills={skills} />))}
                  </Table.Body>
                </Table>
              </Grid.Column>

              <Grid.Column width={3}>
                <Header as="h2" textAlign="center">Tools</Header>

                <Grid>
                  <Grid.Column textAlign="center">
                    <Button as={NavLink} activeClassName="active" exact
                            to={ROUTES.ADD_TOOL} key='addTool' size='large'>Add
                      Tool</Button>
                  </Grid.Column>
                </Grid>

                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Tools</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {this.props.tools.map((tools => <ToolsAdmin key={tools._id} tools={tools} />))}
                  </Table.Body>
                </Table>

              </Grid.Column>

            </Grid.Row>
          </Grid>
        </div>

    );
  }
}

// Require an array of Stuff documents in the props.
ConfigureHACC.propTypes = {
  tools: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const subscription = Challenges.subscribe();
  const subscription2 = Skills.subscribe();
  const subscription3 = Tools.subscribe();
  return {
    challenges: Challenges.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    ready: subscription.ready() && subscription2.ready() && subscription3.ready(),
  };
})(ConfigureHACC);
