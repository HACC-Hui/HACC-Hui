import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Icon, Grid, Header, Table, Divider, Image, Loader, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Developers } from '../../api/user/DeveloperCollection';
import { DeveloperChallenges } from '../../api/user/DeveloperChallengeCollection';
import { DeveloperSkills } from '../../api/user/DeveloperSkillCollection';
import { DeveloperTools } from '../../api/user/DeveloperToolCollection';
import { DeveloperInterests } from '../../api/user/DeveloperInterestCollection';
/** import ChallengesAdmin from '../components/ChallengesAdmin';
 import SkillsAdmin from '../components/SkillsAdmin';
 import ToolsAdmin from '../components/ToolsAdmin'; */
/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class UserProfile extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <Container>
          <Divider hidden/>
          <Divider hidden/>
          <Segment className='profThing'>
            <Grid>
              <Grid.Column width={13}>
                <Header as="h2" textalign="center">My Profile</Header>
              </Grid.Column>
              <Grid.Column width={3} textAlign='right'>
                <Icon className='segIcon' name='edit'/> <Link className='profLink'
                                                              to={`/editprofile/${this.props.Developers.userID}`}>
                <b>Edit
                Profile</b></Link>
              </Grid.Column>
            </Grid>
          </Segment>
          <Grid verticalalign='middle'>
            <Grid.Row>
              <Grid.Column width={1}/>
              <Grid.Column width={4}>
                <Image circular className='userImage'
                       fluid
                       src={this.props.Developers.image}/>
                       <p>image</p>
              </Grid.Column>
              <Grid.Column width={10} verticalAlign='middle' textAlign='justified'>
                <Header
                    as='h3'>{this.props.Developers.username} username
                </Header>
                <p>{this.props.Developers.aboutMe} about me</p>
              </Grid.Column>
              <Grid.Column width={1}/>
            </Grid.Row>
          </Grid>

          <Divider hidden/>
          <Divider hidden/>
          <Segment className='profThing'>
            <Divider horizontal className='profDivider'><Header as='h3'>Information</Header></Divider>
            <Divider hidden/>
            <Grid textAlign='center'>
              <Grid.Row>
                <Grid.Column textAlign='center' width={15}>
                  <Table padded textalign='center'>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell><b>Interests</b></Table.Cell>
                        <Table.Cell>{this.props.Developers.Interests}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><b>Skills</b></Table.Cell>
                        <Table.Cell>{this.props.Developers.Skills}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><b>Tools</b></Table.Cell>
                        <Table.Cell>{this.props.Developers.Tools}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><b>Challenges</b></Table.Cell>
                        <Table.Cell>{this.props.Developers.Challenges}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><b>Links</b></Table.Cell>
                        <Table.Cell>{this.props.Developers.Interests}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><b>Links</b></Table.Cell>
                        <Table.Cell>{this.props.Developers.gitHub}</Table.Cell>
                        <Table.Cell>{this.props.Developers.linkedIn}</Table.Cell>
                        <Table.Cell>{this.props.Developers.website}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><b>Demographic Level</b></Table.Cell>
                        <Table.Cell>{this.props.Developers.demographicLevel}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell><b>Name</b></Table.Cell>
                        <Table.Cell>{this.props.Developers.firstName}</Table.Cell>
                        <Table.Cell>{this.props.Developers.lastName}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider hidden/>
          </Segment>
        </Container>
    );
  }
}

UserProfile.propTypes = {
  Developers: PropTypes.array.isRequired,
  DeveloperChallenges: PropTypes.array.isRequired,
  DeveloperSkills: PropTypes.array.isRequired,
  DeveloperTools: PropTypes.array.isRequired,
  DeveloperInterests: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const subscription = Meteor.subscribe('DeveloperCollection');
  return {
    Developers: Developers.find({}).fetch(),
    DeveloperChallenges: DeveloperChallenges.find({}).fetch(),
    DeveloperSkills: DeveloperSkills.find({}).fetch(),
    DeveloperTools: DeveloperTools.find({}).fetch(),
    DeveloperInterests: DeveloperInterests.find({}).fetch(),
    ready: subscription.ready(),
  };
})(UserProfile);
