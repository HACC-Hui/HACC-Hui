import React from 'react';
import { Header, Grid, Button, Loader, Image, Icon } from 'semantic-ui-react';
// eslint-disable-next-line no-unused-vars
import { ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Developers } from '../../api/user/DeveloperCollection';
import { DeveloperSkills } from '../../api/user/DeveloperSkillCollection';
import { DeveloperChallenges } from '../../api/user/DeveloperChallengeCollection';
import { DeveloperTools } from '../../api/user/DeveloperToolCollection';

/**
 * Profile page
 * @memberOf ui/pages
 */
class profile extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */

  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    // console.log(this.props.developer);
    // console.log(this.props.developer.firstName);
    return (
        <div style={{ backgroundColor: '#C4C4C4' }}>
          <Grid container centered>
            <Grid.Column>
              <div className='profileBox' style={{ padding: '1rem 5rem', margin: '2rem 0rem' }}>
                <Grid columns={2} relaxed='very' stackable>
                  <Grid.Column width={6}>
                    <div className='innerProfileBox' style={{
                      padding: '1rem 5rem', margin: '2rem 0rem',
                      borderRadius: '2rem',
                    }}>
                      <Grid columns={8} divided style={{ paddingTop: '1rem' }}>
                        <Grid.Row centered>
                          <Header inverted as="h3" textAlign="center">Team</Header>
                        </Grid.Row>
                        <Grid.Row centered>
                          <Image
                              style={{ borderRadius: '50%', width: '80%', height: 'auto' }}
                              src={'https://writestylesonline.com/wp-content/uploads/2018/11/Three-Statistics-That-Will-Make-You-Rethink-Your-Professional-Profile-Picture-1024x1024.jpg'}/>
                        </Grid.Row>
                        <Grid.Row centered>
                          <Header inverted as="h3" textAlign="center">
                            {this.props.developer.firstName} {this.props.developer.lastName}
                            <p>University Student</p>
                          </Header>
                        </Grid.Row>

                        <Grid.Row centered>
                          <Header inverted as="h3" textAlign="center">Links</Header>
                        </Grid.Row>
                        <Grid.Row centered>
                          <Header inverted as="h3" textAlign="center">Challenges</Header>
                        </Grid.Row>
                        <Grid.Row centered>
                          <Header inverted as="h3" textAlign="center">Challenge1</Header>
                        </Grid.Row>
                        <Grid.Row centered>
                          <Header inverted as="h3" textAlign="center">Challenge2</Header>
                        </Grid.Row>
                      </Grid>
                    </div>
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <Button floated='right' style={{
                      backgroundColor: '#272727',
                      color: 'white',
                      margin: '1rem 5rem',
                    }}>
                      EDIT
                    </Button>
                    <Grid className="info">
                      <Grid.Row>
                        <Header inverted as="h3">About Me</Header>
                        <p>mi ipsum faucibus vitae aliquet nec ullamcorper sit amet risus nullam
                          eget felis eget nunc lobortis mattis aliquam faucibus purus in massa
                          tempor
                          nec feugiat nisl pretium fusce id velit ut tortor pretium viverra
                          suspendisse
                          potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi
                          lacus
                          sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus
                          est</p>
                      </Grid.Row>
                      <Grid.Row>
                        <Header inverted as="h3">Skills</Header>
                        <p>mi ipsum faucibus vitae aliquet nec ullamcorper sit amet risus nullam
                          eget felis eget nunc lobortis mattis aliquam faucibus purus in massa
                          tempor
                          nec feugiat nisl pretium fusce id velit ut tortor pretium viverra
                          suspendisse
                          potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi
                          lacus
                          sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus
                          est</p>
                      </Grid.Row>
                      <Grid.Row>
                        <Header inverted as="h3">Tools</Header>
                        <p>mi ipsum faucibus vitae aliquet nec ullamcorper sit amet risus nullam
                          eget felis eget nunc lobortis mattis aliquam faucibus purus in massa
                          tempor
                          nec feugiat nisl pretium fusce id velit ut tortor pretium viverra
                          suspendisse
                          potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi
                          lacus
                          sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus
                          est</p>
                      </Grid.Row>
                    </Grid>
                  </Grid.Column>
                </Grid>
              </div>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

/** Require the presence of a Developer document in the props object. Uniforms adds 'model' to the props, which we use. */
profile.propTypes = {
  developer: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const userID = Meteor.user()._id;
  // Get access to Developers documents.
  const sub1 = Developers.subscribe();
  const sub2 = DeveloperSkills.subscribe();
  const sub3 = DeveloperChallenges.subscribe();
  const sub4 = DeveloperTools.subscribe();

  return {
    developer: Developers.findOne({ userID: userID }),
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
  };
})(profile);
