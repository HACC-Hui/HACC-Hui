import React from 'react';
import {
  Grid,
  Header,
  Loader,
  Item,
  Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { DeveloperChallenges } from '../../../api/user/DeveloperChallengeCollection';
import { DeveloperSkills } from '../../../api/user/DeveloperSkillCollection';
import { DeveloperTools } from '../../../api/user/DeveloperToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import { InterestedDevs } from '../../../api/team/InterestedDeveloperCollection';
import { TeamDevelopers } from '../../../api/team/TeamDeveloperCollection';
import InterestedDeveloperCard from '../../components/InterestedDeveloperCard';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class InterestedDevelopers extends React.Component {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {

    if (this.props.developers.length === 0) {
      return (
          <div align={'center'}>
            <Header as='h2' icon>
              <Icon name='users'/>
              There are no interested developers at the moment.
              <Header.Subheader>
                Please check back later.
              </Header.Subheader>
            </Header>
          </div>
      );
    }

    const universalSkills = this.props.skills;

    function getDeveloperSkills(developerID, developerSkills) {
      const data = [];
      const skills = _.filter(developerSkills, { developerID: developerID });
      for (let i = 0; i < skills.length; i++) {
        for (let j = 0; j < universalSkills.length; j++) {
          if (skills[i].skillID === universalSkills[j]._id) {
            data.push({ name: universalSkills[j].name, level: skills[i].skillLevel });
          }
        }
      }
      console.log(data);
      return data;
    }

    const universalDevs = this.props.developers;

    function getInterestedDevelopers(devs) {
      const data = [];
      for (let i = 0; i < devs.length; i++) {
        for (let j = 0; j < universalDevs.length; j++) {
          if (devs[i].developerID === universalDevs[j]._id) {
            data.push(universalDevs[j]);
          }
        }
      }
      console.log(data);
      return data;
    }

    const universalTools = this.props.tools;

    function getDeveloperTools(developerID, developerTools) {
      const data = [];
      const tools = _.filter(developerTools, { developerID: developerID });
      for (let i = 0; i < tools.length; i++) {
        for (let j = 0; j < universalTools.length; j++) {
          if (tools[i].toolID === universalTools[j]._id) {
            data.push({ name: universalTools[j].name, level: tools[i].toolLevel });
          }
        }
      }
      console.log(data);
      return data;
    }

    const universalChallenges = this.props.challenges;

    function getDeveloperChallenges(developerID, developerChallenges) {
      const data = [];
      const challenges = _.filter(developerChallenges, { developerID: developerID });
      for (let i = 0; i < challenges.length; i++) {
        for (let j = 0; j < universalChallenges.length; j++) {
          if (challenges[i].challengeID === universalChallenges[j]._id) {
            data.push(universalChallenges[j].title);
          }
        }
      }
      return data;
    }

    return (
        <Grid container doubling relaxed stackable>
          <Grid.Row centered>
            <Header as={'h2'} style={{ paddingTop: '2rem' }}>
              Interested Developers
            </Header>
          </Grid.Row>
          <Grid.Row>
          <Grid.Column>
            <Item.Group divided>
              {/* eslint-disable-next-line max-len */}
              {getInterestedDevelopers(this.props.interestedDevs).map((developers) => <InterestedDeveloperCard key={developers._id} developers={developers} teams={this.props.teams}
                   skills={getDeveloperSkills(developers._id, this.props.developerSkills)}
                   tools={getDeveloperTools(developers._id, this.props.developerTools)}
                   challenges={getDeveloperChallenges(developers._id, this.props.developerChallenges)}
                  />)}
            </Item.Group>
          </Grid.Column>
          </Grid.Row>
        </Grid>
    );
  }
}

InterestedDevelopers.propTypes = {
  developerChallenges: PropTypes.array.isRequired,
  interestedDevs: PropTypes.array.isRequired,
  developerSkills: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  developerTools: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  developers: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,

};

export default withTracker(({ match }) => {
  const documentId = match.params._id;
  const subscriptionChallenges = DeveloperChallenges.subscribe();
  const subscriptionSkills = DeveloperSkills.subscribe();
  const subscriptionTools = DeveloperTools.subscribe();
  const subscriptionDevelopers = Developers.subscribe();
  const subscriptionInterestedDevs = InterestedDevs.subscribe();
  const subscriptionTeamDevelopers = TeamDevelopers.subscribe();
  const subscriptionTeam = Teams.subscribe();
  const subSkills = Skills.subscribe();
  const subChallenges = Challenges.subscribe();
  const subTools = Tools.subscribe();
  console.log(Teams.find({ _id: documentId }).fetch());
  // eslint-disable-next-line max-len
  // console.log(InterestedDevs.find({ teamID: TeamDevelopers.findDoc({ developerID: Developers.findDoc({ userID: Meteor.userId() })._id }).teamID }).fetch());

  return {
    // eslint-disable-next-line max-len
    developers: Developers.find({}).fetch(),
    developerChallenges: DeveloperChallenges.find({}).fetch(),
    developerSkills: DeveloperSkills.find({}).fetch(),
    developerTools: DeveloperTools.find({}).fetch(),
    // eslint-disable-next-line max-len
    interestedDevs: InterestedDevs.find({ teamID: documentId }).fetch(),
    teams: Teams.find({ _id: documentId }).fetch(),
    skills: Skills.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    // developers: Developers.find({}).fetch(),
    // eslint-disable-next-line max-len
    ready: subscriptionChallenges.ready() && subscriptionSkills.ready() && subscriptionTools.ready()
        // eslint-disable-next-line max-len
        && subscriptionDevelopers.ready() && subscriptionInterestedDevs.ready() && subscriptionTeamDevelopers.ready() && subscriptionTeam.ready() && subSkills.ready() && subTools.ready()
        && subChallenges.ready(),
  };
})(InterestedDevelopers);
