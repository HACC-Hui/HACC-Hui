import React from 'react';
import {
  Container,
  Table,
  Header,
  Loader,
  Card,
  Image,
  Icon,
  Grid,
  Segment,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import { Teams } from '../../api/team/TeamCollection';
import TeamFinderCard from '../components/TeamFinderCard';
import MultiSelectField from '../controllers/MultiSelectField';
import RadioField from '../controllers/RadioField';

/**
 * **Deprecated**
 *
 * Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row.
 * @memberOf ui/pages
 */
class TeamFinder extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    console.log(this.props.teams);
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <div style={{ backgroundColor: '#C4C4C4' }}>
          <Grid container centered>
            <Grid.Column>
              <div style={{
                backgroundColor: '#393B44', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem',
              }}>
                <Header as="h2" textAlign="center" inverted>Team Finder</Header>
              </div>
              <div align={'center'}>
                <Card.Group stackable centered doubling style={{ marginBottom: '2rem' }}>
                  {this.props.teams.map((teams) => <TeamFinderCard key={teams._id} teams={teams}/>)}
                </Card.Group>
              </div>
            </Grid.Column>
          </Grid>
        </div>
        // <Container>
        //   <Card.Group stackable align={'center'} doubling>
        //     {this.props.teams.map((teams) => <TeamFinderCard key={teams._id} teams={teams} />)}
        //   </Card.Group>
        // </Container>
    );
  }
}

// Require an array of Stuff documents in the props.
TeamFinder.propTypes = {
  teams: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Team documents.
  const subscription = Teams.subscribe();
  return {
    teams: Teams.find({}).fetch(),
    ready: subscription.ready(),
  };
})(TeamFinder);
