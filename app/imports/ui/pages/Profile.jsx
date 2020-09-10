import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Container, Icon, Segment, Form, Button, Item, Loader, Label, Modal } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, TextField, SubmitField, HiddenField, LongTextField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import PropTypes from 'prop-types';
import { Skills } from '../../api/skill/SkillCollection';
import { Tools } from '../../api/tool/ToolCollection';
import { Challenges } from '../../api/challenge/ChallengeCollection';
import { Interests } from '../../api/interest/InterestCollection';
import { Developers } from '../../api/user/DeveloperCollection';
import Skill from '../components/Skill';
import Tool from '../components/Tool';
import Challenge from '../components/Challenge';
import Interest from '../components/Interest';
// import EditProfile from '../components/EditProfile';

class Profile extends React.Component {

  state = { open: false }

  open = () => this.setState({ open: true })

  close = () => this.setState({ open: false })

  submit = (data) => {
    const { username, slugID, firstName, lastName, demographicLevel, linkedIn, gitHub, website, aboutMe,
      userID, lookingForTeam, isCompliant, _id } = data;
    Developers.update(_id, { $set: { username, slugID, firstName, lastName, demographicLevel,
      linkedIn, gitHub, website, aboutMe, userID, lookingForTeam, isCompliant } }, (error) => (error ?
        swal('Error', error.message, 'error') :
        swal('Success', 'Item updated successfully', 'success')));
  }

  componentDidMount() {
    console.log('User email');
    console.log(this.props.developers.filter(currUser => currUser.username === this.props.currentUser));
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    const currentUser = this.props.developers.find(currUser => currUser.username === this.props.currentUser);
    const formSchema = new SimpleSchema2Bridge(Developers.getSchema());
    return (
        <Container style={{ height: '1500px' }}>
          <div id='cover-photo'>
            <Grid id='grid-style'>
              <Grid.Column width={8} style={{ paddingLeft: '6em' }}>
                <Grid.Row>
                  <Item>
                    {/* eslint-disable-next-line max-len */}
                    <Item.Image src='/images/basic_pic.png' size='small' circular id='profile-pic' style={{ float: 'left' }}/>
                    <Item.Content>
                      <Item.Header id='name-style'>
                        {currentUser.firstName} {currentUser.lastName}
                        <Icon name='pencil' inverted size='mini' id='name-edit-icon' onClick={this.open}/>
                        <Modal
                            open={this.state.open}
                        >
                          <Modal.Header>Edit Profile</Modal.Header>
                          <Modal.Content scrolling>
                            {/* <EditProfile handleClick={this.submit}/> */}
                            <AutoForm schema={formSchema} onSubmit={data => this.submit(data)} model={this.props.doc}>
                              <TextField name='username' value={currentUser.username} disabled/>
                              <HiddenField name='slugID' value={currentUser.slugID} disabled/>
                              <TextField name='firstName' placeholder={currentUser.firstName}/>
                              <TextField name='lastName' placeholder={currentUser.lastName}/>
                              <LongTextField name='aboutMe' placeholder={currentUser.aboutMe}/>
                              <TextField name='website' placeholder={currentUser.website}/>
                              <TextField name='gitHub' placeholder={currentUser.gitHub}/>
                              <TextField name='linkedIn' placeholder={currentUser.linkedIn}/>
                              <SubmitField value='Submit'/>
                              <ErrorsField/>
                            </AutoForm>
                          </Modal.Content>
                           <Modal.Actions>
                            <Button
                                content="Ok"
                                color='teal'
                                onClick={this.close}/>
                           </Modal.Actions>
                        </Modal>
                      </Item.Header>
                      <Label.Group size='medium' id='interest-style'>
                        {this.props.interests.map((interest, index) => <Interest
                          key={index} interest={interest}/>)}
                      </Label.Group>
                    </Item.Content>
                  </Item>
                </Grid.Row>
                <Grid.Row style={{ paddingTop: '20px' }}>
                  <p id='header-style'>
                    About me
                  </p>
                  <hr id='line-style'/>
                  <p id='info-style' style={{ paddingTop: '10px' }}>
                    {currentUser.aboutMe}
                  </p>
                </Grid.Row>
                <Grid.Row style={{ paddingTop: '20px' }}>
                  <p id='header-style'>
                    Contact me
                  </p>
                  <hr id='line-style'/>
                  <div id='info-style' style={{ paddingTop: '10px' }}>Website</div>
                  <a id='info-style' style={{ paddingTop: '7px' }} href="https://hacc-hui.github.io/">
                    {currentUser.website}
                  </a>
                  <div id='info-style' style={{ paddingTop: '30px' }}><Icon name='mail'/>Email</div>
                  <a id='info-style' style={{ paddingTop: '7px' }} href="mailto:@gmail.com">
                    {this.props.currentUser}
                  </a>
                  <div id='info-style' style={{ paddingTop: '30px' }}><Icon name='github'/>Github</div>
                  <a id='info-style' style={{ paddingTop: '7px' }} href="https://github.com/">
                    {currentUser.gitHub}
                  </a>
                  <div id='info-style' style={{ paddingTop: '30px' }}><Icon name='linkedin'/>LinkedIn</div>
                  <a id='info-style' style={{ paddingTop: '7px' }} href="https://www.linkedin.com/">
                    {currentUser.linkedIn}
                  </a>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column width={7} style={{ paddingLeft: '5em' }}>
                <Segment id='segment-form-style' >
                  <Form>
                    <p style={{
                      marginTop: '28px',
                      marginBottom: '0px',
                      fontWeight: '600',
                      fontSize: '24px',
                    }}>
                      SKILLS
                    </p>
                    <hr id='line-style'/>
                    <Item.Group>
                      {this.props.skills.map((skill, index) => <Skill key={index} skill={skill}/>)}
                    </Item.Group>
                    <p id='header-style'>
                      TOOLS
                    </p>
                    <hr id='line-style'/>
                    <Item.Group>
                      {this.props.tools.map((tool, index) => <Tool key={index} tool={tool}/>)}
                    </Item.Group>
                    <p id='header-style'>
                      CHALLENGES
                    </p>
                    <hr id='line-style'/>
                    <Item.Group>
                      {this.props.challenges.map((challenge, index) => <Challenge key={index} challenge={challenge}/>)}
                    </Item.Group>
                    <Button type='button' color='teal' style={{ marginLeft: '150px' }}>Submit</Button>
                  </Form>
                </Segment>
              </Grid.Column>
            </Grid>
          </div>
        </Container>
    );
  }

}

/** Declare the types of all properties. */
Profile.propTypes = {
  currentUser: PropTypes.string,
  ready: PropTypes.bool.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  interests: PropTypes.array.isRequired,
  developers: PropTypes.array.isRequired,
  doc: PropTypes.object,
  model: PropTypes.object,
};

// this is required to make the name show up
/** withTracker connects Meteor data to Reactx components. https://guide.meteor.com/react.html#using-withTracker */
const ProfileContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(Profile);

export default withTracker(({ match }) => {
  const documentId = match.params._id;
  // Get access to Developers documents.
  const subSkill = Skills.subscribe();
  const subTool = Tools.subscribe();
  const subChal = Challenges.subscribe();
  const subInt = Interests.subscribe();
  const subDev = Developers.subscribe();
  return {
    doc: Developers.findOne(documentId),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    interests: Interests.find({}).fetch(),
    developers: Developers.find({}).fetch(),
    ready: subSkill.ready() && subTool.ready() && subChal.ready() && subInt.ready() && subDev.ready(),
  };
})(ProfileContainer);
