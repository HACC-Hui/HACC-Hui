import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Grid, Header, Container } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import InterestedDevelopersExampleWidget from './InterestedDevelopersExampleWidget';
import { DeveloperSkills } from '../../../api/user/DeveloperSkillCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { DeveloperTools } from '../../../api/user/DeveloperToolCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { InterestedDevelopers } from '../../../api/team/InterestedDevelopersCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import { DeveloperInterests } from '../../../api/user/DeveloperInterestCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { DeveloperChallenges } from '../../../api/user/DeveloperChallengeCollection';
import { TeamDevelopers } from '../../../api/team/TeamDeveloperCollection';

const checkSelf = (interestedDevelopers) => interestedDevelopers.developerID;

const checkSelfTeam = (interestedDevelopers, currTeam) => {
  let bool = null;
  if (interestedDevelopers.teamID === currTeam) {
    bool = true;
  } else {
    bool = false;
  }
    return bool;
};

const getDeveloperName = (interestedDevelopers) => {
  const developerID = interestedDevelopers.developerID;
  const developerList = Developers.find({}).fetch();
  let developerName = '';
  for (const key in developerList) {
    if (developerList[key]._id === developerID) {
      developerName = `${developerList[key].firstName} ${developerList[key].lastName}`;
    }
  }
  return developerName;
};

const getDeveloperDescription = (interestedDevelopers) => {
  const developerID = interestedDevelopers.developerID;
  const developerList = Developers.find({}).fetch();
  let developerDescription = '';
  for (const key in developerList) {
    if (developerList[key]._id === developerID) {
      developerDescription = developerList[key].aboutMe;
    }
  }
  return developerDescription;
};

const getDeveloperEducation = (interestedDevelopers) => {
  const developerID = interestedDevelopers.developerID;
  const developerList = Developers.find({}).fetch();
  let developerEducation = '';
  for (const key in developerList) {
    if (developerList[key]._id === developerID) {
      developerEducation = developerList[key].demographicLevel;
    }
  }
  return developerEducation;
};

const getDeveloperSkills = (interestedDevelopers) => {
  let developerID = interestedDevelopers.developerID;
  const developerList = Developers.find({}).fetch();
  let skillTitles = '';
  for (const key in developerList) {
    if (developerList[key]._id === developerID) {
      developerID = developerList[key]._id;
      const developerSkillsDocs = DeveloperSkills.find({ developerID }).fetch();
      skillTitles = developerSkillsDocs.map((tc) => Skills.findDoc(tc.skillID).name);
    }
  }
  skillTitles = skillTitles.join();
  return skillTitles;
};

const getDeveloperTools = (interestedDevelopers) => {
  let developerID = interestedDevelopers.developerID;
  const developerList = Developers.find({}).fetch();
  let toolTitles = '';
  for (const key in developerList) {
    if (developerList[key]._id === developerID) {
      developerID = developerList[key]._id;
      const developerToolsDocs = DeveloperTools.find({ developerID }).fetch();
      toolTitles = developerToolsDocs.map((tc) => Tools.findDoc(tc.toolID).name);
    }
  }
  toolTitles = toolTitles.join();
  return toolTitles;
};

const getDeveloperInterests = (interestedDevelopers) => {
  let developerID = interestedDevelopers.developerID;
  const developerList = Developers.find({}).fetch();
  let interestTitles = '';
  for (const key in developerList) {
    if (developerList[key]._id === developerID) {
      developerID = developerList[key]._id;
      const developerInterestsDocs = DeveloperInterests.find({ developerID }).fetch();
      interestTitles = developerInterestsDocs.map((tc) => Interests.findDoc(tc.interestID).name);
    }
  }
  interestTitles = interestTitles.join();
  return interestTitles;
};

const getDeveloperChallenges = (interestedDevelopers) => {
  let developerID = interestedDevelopers.developerID;
  const developerList = Developers.find({}).fetch();
  let challengeTitles = '';
  for (const key in developerList) {
    if (developerList[key]._id === developerID) {
      developerID = developerList[key]._id;
      const developerChallengesDocs = DeveloperChallenges.find({ developerID }).fetch();
      challengeTitles = developerChallengesDocs.map((tc) => Challenges.findDoc(tc.challengeID).title);
    }
  }
  challengeTitles = challengeTitles.join();
  return challengeTitles;
};

class InterestedDevelopersWidget extends React.Component {

  render() {
    return (
        <Container>
        <Grid celled>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Header>Developers Interested</Header>
            </Grid.Column>
          </Grid.Row>
          {this.props.interestedDevelopers.filter((interestedDevelopers) => checkSelfTeam(interestedDevelopers, this.props.currTeam) === true).filter((interestedDevelopers) => checkSelf(interestedDevelopers) !== this.props.currDev).map((interestedDevelopers) => (
              <InterestedDevelopersExampleWidget
                  key={interestedDevelopers._id}
                  developerName={getDeveloperName(interestedDevelopers)}
                  developerSkills={getDeveloperSkills(interestedDevelopers)}
                  developerTools={getDeveloperTools(interestedDevelopers)}
                  developerInterests={getDeveloperInterests(interestedDevelopers)}
                  developerChallenges={getDeveloperChallenges(interestedDevelopers)}
                  developerDescription={getDeveloperDescription(interestedDevelopers)}
                  developerEducation={getDeveloperEducation(interestedDevelopers)}/>
          ))}
        </Grid>
        </Container>
    );
  }
}

InterestedDevelopersWidget.propTypes = {
  interestedDevelopers: PropTypes.arrayOf(
      PropTypes.object,
  ),
  currDev: PropTypes.string,
  currTeam: PropTypes.string,
};

export default withTracker(() => {
  const interestedDevelopers = InterestedDevelopers.find({}).fetch();
  const currUser = Meteor.userId();
  const developerList = Developers.find({}).fetch();
  let currDev = '';
  for (const key in developerList) {
    if (developerList[key].userID === currUser) {
      currDev = developerList[key]._id;
    }
  }
  const developerTeamList = TeamDevelopers.find({}).fetch();
  let currTeam = '';
  let developerID = '';
  for (const key in developerTeamList) {
    if (developerTeamList[key] !== undefined) {
      developerID = developerTeamList[key].developerID;
      if (developerID === currDev) {
        console.log('YES');
        currTeam = developerTeamList[key].teamID;
      }
    }
  }
  return {
    interestedDevelopers,
    currDev,
    currTeam,
  };
})(InterestedDevelopersWidget);
