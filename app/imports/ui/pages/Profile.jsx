import React from 'react';
import { Header, Grid, Button, Loader, Image, Icon, Modal } from 'semantic-ui-react';
// eslint-disable-next-line no-unused-vars
import { ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Developers } from '../../api/user/DeveloperCollection';
import { DeveloperSkills } from '../../api/user/DeveloperSkillCollection';
import { DeveloperChallenges } from '../../api/user/DeveloperChallengeCollection';
import { DeveloperTools } from '../../api/user/DeveloperToolCollection';

/**
 * Profile page
 * @memberOf ui/pages
 */
class profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */

  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    const open = this.state.open;
    console.log(this.props.challenges);
    console.log(this.props.tools);
    console.log(this.props.skills);

    return (
        <div style={{ backgroundColor: '#C4C4C4', padding: '4rem 0rem', marginTop: '-0.7rem' }}>
          <Grid container centered stackable
                className='profileBox' style={{ padding: '1rem 5rem' }}>
            <Grid.Column>
              <Grid columns={2} relaxed='very' stackable>
                <Grid.Column width={6}
                             className='innerProfileBox' style={{
                  padding: '1rem 4rem', margin: '2rem 0rem',
                  borderRadius: '2rem',
                }}>
                  <Grid columns={8} divided style={{ paddingTop: '1rem' }}>
                    <Grid.Row centered>
                      <Header inverted as="h3" textAlign="center">
                        <Icon className={'users'} inverted/>
                        Team: N/A
                      </Header>
                    </Grid.Row>
                    <Grid.Row centered>
                      <Image
                          style={{ borderRadius: '50%', width: '80%', height: 'auto' }}
                          src={'https://writestylesonline.com/wp-content/uploads/2018/11/Three-Statistics-That-Will-Make-You-Rethink-Your-Professional-Profile-Picture-1024x1024.jpg'}/>
                    </Grid.Row>
                    <Grid.Row centered>
                      <Header inverted as="h3" textAlign="center">
                        {this.props.developer.firstName} {this.props.developer.lastName}
                        <p style={{ color: 'white', fontSize: '13px' }}>
                          University Student
                        </p>
                      </Header>
                    </Grid.Row>
                    <Grid.Row centered>
                      <Icon className={'github'} inverted size={'big'} link={true}/>
                      <Icon className={'linkedin'} inverted size={'big'} link={true}/>
                      <a href={'http://linkedin.com/'}>
                        <Icon className={'world'} inverted size={'big'} link={true}/>
                      </a>
                    </Grid.Row>
                    <Grid.Row centered>
                      <Header inverted as="h3" textAlign="center">Challenges</Header>
                      <p style={{ color: 'white', fontSize: '16px' }}>
                        ETS/HGG Community Engagement & Digital Storytelling <br/>
                        HGIA Green Loan Portal
                      </p>
                    </Grid.Row>
                    <Grid.Row centered>

                    </Grid.Row>
                  </Grid>
                </Grid.Column>
                <Grid.Column width={10}>
                  <Modal
                      open={open}
                      trigger={
                        <Button floated='right' style={{
                          backgroundColor: 'rgb(145 30 30)',
                          color: 'white',
                          margin: '1rem 0rem 0rem, 0rem',
                        }}>
                          DELETE
                        </Button>
                      }
                      onClose={() => this.setState({ open: false })}
                      onOpen={() => this.setState({ open: true })}
                  >
                    <Modal.Header>Account Removal Form</Modal.Header>
                    <Modal.Content>
                      <p>
                        {/* eslint-disable-next-line max-len */}
                        Before you go please fill out this questionnaire so we can improve the HACC
                        experience in the future.
                      </p>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button color='red' onClick={() => this.setState({ open: false })}>
                        <Icon name='remove'/> Cancel
                      </Button>
                      <Button color='green' onClick={() => this.setState({ open: false })}
                              as={NavLink} exact
                              to="/deleteAccount">
                        <Icon name='checkmark'/> Form & Delete
                      </Button>
                    </Modal.Actions>
                  </Modal>
                  <Button floated='right' style={{
                    backgroundColor: '#272727',
                    color: 'white',
                    margin: '1rem 0rem 0rem, 0rem',
                  }}
                  as={NavLink} exact to='/editprofile'>
                    EDIT
                  </Button>
                  <Grid className="info">
                    <Grid.Row>
                      <Header inverted as="h2">About Me</Header>
                      <p style={{ color: 'white', fontSize: '16px' }}>
                        Hello this is a description and I have no idea what to write here. But I
                        am typing in English so I can see it is easy to read on the site. Are you
                        still reading this? Why? Stop reading it. Goodbye.
                      </p>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={8} textAlign={'left'} style={{ paddingLeft: '0rem' }}>
                        <Header inverted as="h2">Skills</Header>
                        <p style={{
                          color: 'white',
                          fontSize: '16px',
                          textDecoration: 'underline',
                        }}>
                          EXPERIENCED:
                        </p>
                        <p style={{ color: 'white', fontSize: '16px' }}>
                          Python, Javascript, React.JS
                        </p>
                        <p style={{
                          color: 'white',
                          fontSize: '16px',
                          textDecoration: 'underline',
                        }}>
                          NOVICE:
                        </p>
                        <p style={{ color: 'white', fontSize: '16px' }}>
                          Python, C/C++
                        </p>
                        <p style={{
                          color: 'white',
                          fontSize: '16px',
                          textDecoration: 'underline',
                        }}>
                          DON'T KNOW BUT WOULD LIKE TO LEARN:
                        </p>
                        <p style={{ color: 'white', fontSize: '16px' }}>
                          AWS
                        </p>
                      </Grid.Column>
                      <Grid.Column width={8} textAlign={'left'}>
                        <Header inverted as="h2">Tools</Header>
                        <p style={{
                          color: 'white',
                          fontSize: '16px',
                          textDecoration: 'underline',
                        }}>
                          EXPERIENCED:
                        </p>
                        <p style={{ color: 'white', fontSize: '16px' }}>
                          Python, Javascript, React.JS
                        </p>
                        <p style={{
                          color: 'white',
                          fontSize: '16px',
                          textDecoration: 'underline',
                        }}>
                          NOVICE:
                        </p>
                        <p style={{ color: 'white', fontSize: '16px' }}>
                          Python, C/C++
                        </p>
                        <p style={{
                          color: 'white',
                          fontSize: '16px',
                          textDecoration: 'underline',
                        }}>
                          DON'T KNOW BUT WOULD LIKE TO LEARN:
                        </p>
                        <p style={{ color: 'white', fontSize: '16px' }}>
                          AWS
                        </p>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

/** Require the presence of a Developer document in the props object. Uniforms adds 'model' to the props, which we use. */
profile.propTypes = {
  developer: PropTypes.object.isRequired,
  challenges: PropTypes.object.isRequired,
  tools: PropTypes.object.isRequired,
  skills: PropTypes.object.isRequired,
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
    challenges: DeveloperChallenges.findOne({ userID: userID }),
    tools: DeveloperTools.findOne({ userID: userID }),
    skills: DeveloperSkills.findOne({ userID: userID }),
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
  };
})(profile);
