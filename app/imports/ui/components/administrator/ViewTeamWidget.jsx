import React from 'react';
import { Grid, Segment, Header, Table, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ChallengeInterests } from '../../../api/challenge/ChallengeInterestCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { ROUTES } from '../../../startup/client/route-constants';
import SkillsAdminWidget from './SkillsAdminWidget';
import ChallengesAdminWidget from './ChallengesAdminWidget';
import ToolsAdminWidget from './ToolsAdminWidget';
import { Teams } from '../../../api/team/TeamCollection';

/**
 * Renders the Page for Managing HACC. **deprecated**
 * @memberOf ui/pages
 */
class ViewTeamWidget extends React.Component {
  render() {
    return (
        <div style={{ backgroundColor: '#C4C4C4', paddingBottom: '50px' }}>
          <Grid container centered>
            <Grid.Column>
              <div style={{
                backgroundColor: '#393B44', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem',
              }}>
                <Header as="h2" textAlign="center" inverted>View Teams</Header>
              </div>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

ViewTeamWidget.propTypes = {
  teams: PropTypes.arrayOf(
      PropTypes.object,
  ),
};

export default withTracker(() => {
  const teams = Teams.find({}).fetch();
  return {
    teams,
  };
})(ViewTeamWidget);
