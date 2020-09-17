import React from 'react';
import {
  Grid,
  Segment,
  Header,
  Loader,
  Dropdown,
  Input,
  Popup,
  Form,
  Item,
  Modal,
  Icon,
  Button
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Developers } from '../../../api/user/DeveloperCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import TeamFinderCard from '../../components/TeamFinderCard';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class TeamFinder extends React.Component {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    // console.log(Teams.dumpAll());
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {

    if (this.props.teams.length === 0) {
      return (
          <div align={'center'}>
            <Header as='h2' icon>
              <Icon name='users' />
              There are no available teams at the moment.
              <Header.Subheader>
                Please check back later.
              </Header.Subheader>
            </Header>
          </div>
      );
    }

    const sortBy = [
      { key: 'challenges', text: 'challenges', value: 'challenges' },
      { key: 'skills', text: 'skills', value: 'skills' },
      { key: 'teams', text: 'teams', value: 'teams' },
      { key: 'tools', text: 'tools', value: 'tools' },
    ];

    const sticky = {
      position: '-webkit-sticky',
      position: 'sticky',
      top: '6.5rem',
    };

    const handleSubmit = () => {
      console.log('submitted');
    };

    return (
        <Grid container doubling relaxed stackable>
          <Grid.Row centered>
            <Header as={'h2'}>
              Team Finder
            </Header>
          </Grid.Row>
          <Grid.Column width={4}>
            <Segment style={sticky}>
              <div style={{ paddingTop: '2rem' }}>
                <Header>
                  <Header.Content>
                    Total Teams: 30
                  </Header.Content>
                </Header>
              </div>
              <div style={{ paddingTop: '2rem' }}>
                <Header>
                  <Header.Content>
                    Sort by {' '}
                    <Dropdown
                        inline
                        header='Sort by...'
                        options={sortBy}
                        defaultValue={sortBy[0].value}
                        //onChange={getSort}
                    />
                  </Header.Content>
                </Header>
              </div>
              <div style={{ paddingTop: '2rem' }}>
                <Form onSubmit={handleSubmit}>
                  <Popup
                      trigger={<Input icon='search'
                                      iconPosition='left'
                                      placeholder='Search ...'
                          //onChange={handleSearchChange}
                                      fluid
                      />}
                      content='Press enter to search!'
                      on={'focus'}
                  />
                </Form>
                <div style={{ paddingTop: '2rem' }}>
                  <Header>Challenges</Header>
                  <Dropdown
                      placeholder='Challenges'
                      fluid
                      multiple
                      search
                      selection
                      //options={internships.dropdownSkills()}
                      //onChange={getSkills}
                  />
                </div>
              </div>
              <div style={{ paddingTop: '2rem' }}>
                <Header>Skills</Header>
                <Dropdown placeholder='Skills'
                          fluid
                          multiple
                          search
                          selection
                    //options={internships.dropdownSkills()}
                    //onChange={getSkills}
                />
              </div>

              <div style={{ paddingTop: '2rem' }}>
                <Header>Tools</Header>
                <Dropdown
                    placeholder='Tools'
                    fluid
                    multiple
                    search
                    selection
                    //options={internships.dropdownSkills()}
                    //onChange={getSkills}
                />
              </div>


            </Segment>
          </Grid.Column>
          <Grid.Column width={12}>
            <Item.Group divided>
              {this.props.teams.map((teams) => <TeamFinderCard key={teams._id} teams={teams}/>)}
            </Item.Group>
          </Grid.Column>

        </Grid>
    );
  }
}

TeamFinder.propTypes = {
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  developers: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,

};

export default withTracker(() => {
  const subscriptionChallenges = Challenges.subscribe();
  const subscriptionSkills = Skills.subscribe();
  const subscriptionTools = Tools.subscribe();
  const subscriptionDevelopers = Developers.subscribe();
  const subscriptionTeam = Teams.subscribe();

  return {
    challenges: Challenges.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    teams: Teams.find({}).fetch(),
    developers: Developers.find({}).fetch(),
    // eslint-disable-next-line max-len
    ready: subscriptionChallenges.ready() && subscriptionSkills.ready() && subscriptionTools.ready() && subscriptionDevelopers.ready() && subscriptionTeam.ready(),
  };
})(TeamFinder);
