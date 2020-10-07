import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantInterests } from '../../../api/user/ParticipantInterestCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { paleBlueStyle } from '../../styles';
import ProfileCard from './ProfileCard';
import { ROUTES } from '../../../startup/client/route-constants';
import TeamMembershipWidget from './TeamMembershipWidget';

class EditProfileWidget extends React.Component {

  buildTheModel() {
    const model = this.props.participant;
    model.challenges = _.map(this.props.devChallenges, (challenge) => {
      const c = Challenges.findDoc(challenge.challengeID);
      return c.title;
    });
    model.interests = _.map(this.props.devInterests, (interest) => {
      const i = Interests.findDoc(interest.interestID);
      return i.name;
    });
    model.skills = _.map(this.props.devSkills, (skill) => {
      // console.log(skill);
      const s = Skills.findDoc(skill.skillID);
      const ret = {};
      ret.slug = Slugs.getNameFromID(s.slugID);
      ret.level = skill.skillLevel;
      // console.log(ret);
      return ret;
    });
    model.tools = _.map(this.props.devTools, (tool) => {
      const t = Tools.findDoc(tool.toolID);
      const ret = {};
      ret.slug = Slugs.getNameFromID(t.slugID);
      ret.level = tool.toolLevel;
      return ret;
    });
    return model;
  }

  render() {
    // console.log(this.props);
    const model = this.buildTheModel();
    return (
        <Container>
          <Segment style={paleBlueStyle}>
            <Header dividing>Your Profile</Header>
            <ProfileCard model={model} />
            <Button><Link to={ROUTES.EDIT_PROFILE}>Edit Profile</Link></Button>
          </Segment>
          <Segment>
            <Header dividing>Team Membership</Header>
            <TeamMembershipWidget />
          </Segment>
        </Container>
    );
  }
}

EditProfileWidget.propTypes = {
  participant: PropTypes.object.isRequired,
  devChallenges: PropTypes.arrayOf(
      PropTypes.object,
  ),
  devInterests: PropTypes.arrayOf(
      PropTypes.object,
  ),
  devSkills: PropTypes.arrayOf(
      PropTypes.object,
  ),
  devTools: PropTypes.arrayOf(
      PropTypes.object,
  ),
};

const EditProfileWidgetCon = withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  const participantID = participant._id;
  const devChallenges = ParticipantChallenges.find({ participantID }).fetch();
  const devInterests = ParticipantInterests.find({ participantID }).fetch();
  const devSkills = ParticipantSkills.find({ participantID }).fetch();
  const devTools = ParticipantTools.find({ participantID }).fetch();
  return {
    participant,
    devChallenges,
    devInterests,
    devSkills,
    devTools,
  };
})(EditProfileWidget);

export default withRouter(EditProfileWidgetCon);
