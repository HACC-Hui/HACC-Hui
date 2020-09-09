import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Image, Grid, Container, Icon, Checkbox, List, Segment,
  Form, Button, Item, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Skills } from '../../api/skill/SkillCollection';
import { Tools } from '../../api/tool/ToolCollection';
import Skill from '../components/Skill';
import Tool from '../components/Tool';

const challenges = ['HGIA Green Loan Portal', 'ETS/HGG Community Engagement & Digital Storytelling',
  'Energy/HECO Electric Vehicle Charging Analysis', 'DOE Aloha+ Curricular Database'];

class Profile extends React.Component {

  state = { checked: false }

  toggle = () => this.setState((prevState) => ({ checked: !prevState.checked }))

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    return (
        <Container style={{ height: '1500px' }}>
          <div id='cover-photo'>
            <Grid id='grid-style'>
              <Grid.Column width={7} style={{ paddingLeft: '7em' }}>
                <Grid.Row length={3}>
                  <div>
                    {/* eslint-disable-next-line max-len */}
                    <Image src='/images/basic_pic.png' size='small' circular id='profile-pic' style={{ display: 'inline' }}/>
                    <span id='name-style'>{this.props.currentUser}</span>
                  </div>
                </Grid.Row>
                <Grid.Row style={{ paddingTop: '15px' }}>
                  <p id='header-style'>
                    About me
                  </p>
                  <hr id='line-style'/>
                  <p id='info-style' style={{ paddingTop: '10px' }}>
                    Hi my name is John and I’m married to Jane and I like making friends.
                  </p>
                </Grid.Row>
                <Grid.Row style={{ paddingTop: '20px' }}>
                  <p id='header-style'>
                    Contact me
                  </p>
                  <hr id='line-style'/>
                  <div id='info-style' style={{ paddingTop: '10px' }}>Website</div>
                  <a id='info-style' style={{ paddingTop: '7px' }} href="https://hacc-hui.github.io/">
                    https://hacc-hui.github.io/
                  </a>
                  <div id='info-style' style={{ paddingTop: '30px' }}><Icon name='mail'/>Email</div>
                  <a id='info-style' style={{ paddingTop: '7px' }} href="mailto:@gmail.com">
                    {this.props.currentUser}
                  </a>
                  <div id='info-style' style={{ paddingTop: '30px' }}><Icon name='github'/>Github</div>
                  <a id='info-style' style={{ paddingTop: '7px' }} href="https://github.com/">
                    https://github.com/
                  </a>
                  <div id='info-style' style={{ paddingTop: '30px' }}><Icon name='linkedin'/>LinkedIn</div>
                  <a id='info-style' style={{ paddingTop: '7px' }} href="https://www.linkedin.com/">
                    https://www.linkedin.com/
                  </a>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column width={8} style={{ paddingLeft: '9em' }}>
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
                    {challenges.map((c) => (
                        // eslint-disable-next-line react/jsx-key
                        <List>
                          <List.Item id='radio-style'>
                            <Checkbox label={c}/>
                          </List.Item>
                        </List>
                    ))}
                    <Button type='submit' style={{ marginLeft: '150px' }}>Submit</Button>
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
  currentEmail: PropTypes.string,
  ready: PropTypes.bool.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
};

// this is required to make the name show up
/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const ProfileContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
  currentEmail: Meteor.user() ? Meteor.user().email : '',
}))(Profile);

export default withTracker(() => {
  const subSkill = Meteor.subscribe('SkillCollection');
  const subTool = Meteor.subscribe('ToolCollection');
  return {
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    ready: subSkill.ready() && subTool.ready(),
  };
})(ProfileContainer);
