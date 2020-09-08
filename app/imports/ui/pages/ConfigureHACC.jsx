import React from 'react';
import { Container, Table, Header, Loader, Grid, Image, Button} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Stuffs } from '../../api/stuff/StuffCollection';
import StuffItemAdmin from '../components/StuffItemAdmin';
import AddChallenge from '../pages/AddChallenge';
import AddSkill from '../pages/AddSkill';
import AddTool from '../pages/AddTool';

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
		<Grid columns={3} divided>
		 <Grid.Row>
		 <Grid.Column>
          <Header as="h2" textAlign="center">Challenges</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Challenges</Table.HeaderCell>
                <Table.HeaderCell>Edit</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.stuffs.map((stuff) => <StuffItemAdmin key={stuff._id} stuff={stuff} />)}
            </Table.Body>
          </Table>
		  <Grid>
            <Grid.Column textAlign="center">
		       <Button as={NavLink} activeClassName="active" exact to="/addChallenge" key='addChallenge' size='large'>Edit Challenges</Button>
            </Grid.Column>
           </Grid>
		  </Grid.Column>
		  
		  <Grid.Column>
		  <Header as="h2" textAlign="center">Skills</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Skills</Table.HeaderCell>
                <Table.HeaderCell>Edit</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.stuffs.map((stuff) => <StuffItemAdmin key={stuff._id} stuff={stuff} />)}
            </Table.Body>
          </Table>
		  <Grid>
            <Grid.Column textAlign="center">
		       <Button as={NavLink} activeClassName="active" exact to="/addSkill" key='addSkill' size='large'>Edit Skills</Button>
            </Grid.Column>
           </Grid>
		  </Grid.Column>
		  
		  <Grid.Column>
		  <Header as="h2" textAlign="center">Tools</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Tools</Table.HeaderCell>
                <Table.HeaderCell>Edit</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.stuffs.map((stuff) => <StuffItemAdmin key={stuff._id} stuff={stuff} />)}
            </Table.Body>
          </Table>
		  <Grid>
            <Grid.Column textAlign="center">
		       <Button as={NavLink} activeClassName="active" exact to="/addTool" key='addTool' size='large'>Edit Tools</Button>
            </Grid.Column>
           </Grid>
		  </Grid.Column>
		  
		  </Grid.Row>
		 </Grid>
        </div>
		
    );
  }
}

// Require an array of Stuff documents in the props.
ConfigureHACC.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Stuffs.subscribeStuffAdmin();
  return {
    stuffs: Stuffs.find({}).fetch(),
    ready: subscription.ready(),
  };
})(ConfigureHACC);
