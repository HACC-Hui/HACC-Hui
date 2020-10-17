import React from 'react';
import {
  Grid,
  Header,
  Item,
  Icon,
  Segment,
  Input,
  Dropdown,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';
import ListSuggestionsCard from './ListSuggestionsCard';
import ListSuggestionsFilter from './ListSuggestionsFilter';

class ListSuggestionsWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      type: [],
      result: _.orderBy(this.props.suggestions, ['name'], ['asc']),
    };
  }

  render() {

    if (this.props.suggestions.length === 0) {
      return (
          <div align={'center'}>
            <Header as='h2' icon>
              <Icon name='users'/>
              There are no suggestions at the moment.
              <Header.Subheader>
                Please check back later.
              </Header.Subheader>
            </Header>
          </div>
      );
    }

    // eslint-disable-next-line no-unused-vars
    const sortBy = [
      { key: 'teams', text: 'teams', value: 'teams' },
      { key: 'challenges', text: 'challenges', value: 'challenges' },
      { key: 'skills', text: 'skills', value: 'skills' },
      { key: 'tools', text: 'tools', value: 'tools' },
    ];

    const sticky = {
      position: '-webkit-sticky',
      // eslint-disable-next-line no-dupe-keys
      position: 'sticky',
      top: '6.5rem',
    };

    const filters = new ListSuggestionsFilter();

    const setFilters = () => {
      const searchResults = filters.filterBySearch(this.props.suggestions, this.state.search);
      // eslint-disable-next-line max-len
      const typeResults = filters.typeResults(searchResults, this.state.type);
      const sorted = filters.sortBy(typeResults, 'names');
      this.setState({
        result: sorted,
      }, () => {
      });
    };

    const handleSearchChange = (event) => {
      this.setState({
        search: event.target.value,
      }, () => {
        setFilters();
      });
      // this.setState({ search: event.target.value });
      // setFilters();
    };

    // const getSort = (event, { value }) => {
    //   this.setState({
    //     sortBy: value,
    //   }, () => {
    //     setFilters();
    //   });
    // };

    const getType = (event, { value }) => {
      this.setState({
        type: value,
      }, () => {
        setFilters();
      });
    };

    const typeOptions = [
      {
        key: 'All',
        text: 'All',
        value: 'All',
      },
      {
        key: 'Tool',
        text: 'Tool',
        value: 'Tool',
      },
      {
        key: 'Skill',
        text: 'Skill',
        value: 'Skill',
      },
    ];

    console.log(this.props.suggestions);

    return (
        <Grid container doubling relaxed stackable
              style={{ paddingBottom: '4rem' }}
        >
          <Grid.Row centered>
            <Header as={'h2'} style={{ paddingTop: '2rem' }}>
              Suggestions
            </Header>
          </Grid.Row>
          <Grid.Column width={4}>
            <Segment style={sticky}>
              <div style={{ paddingTop: '2rem' }}>
                <Header>
                  <Header.Content>
                    Total Suggestions: {this.state.result.length}
                  </Header.Content>
                </Header>
              </div>
              {/* <div style={{ paddingTop: '2rem' }}> */}
              {/*  <Header> */}
              {/*    <Header.Content> */}
              {/*      Sort by {' '} */}
              {/*      <Dropdown */}
              {/*          inline */}
              {/*          header='Sort by...' */}
              {/*          options={sortBy} */}
              {/*          defaultValue={sortBy[0].value} */}
              {/*          onChange={getSort} */}
              {/*      /> */}
              {/*    </Header.Content> */}
              {/*  </Header> */}
              {/* </div> */}
              <div style={{ paddingTop: '2rem' }}>
                <Input icon='search'
                       iconPosition='left'
                       placeholder='Search...'
                       onChange={handleSearchChange}
                       fluid
                />

                <div style={{ paddingTop: '2rem' }}>
                  <Header>Suggestion Types</Header>
                  <Dropdown
                      placeholder='Types'
                      fluid
                      search
                      selection
                      options={typeOptions}
                      onChange={getType}
                  />
                </div>
              </div>
            </Segment>
          </Grid.Column>
          <Grid.Column width={12}>
            <Item.Group divided>
              {/* eslint-disable-next-line max-len */}
              {this.state.result.map((suggestions) => <ListSuggestionsCard
                  key={suggestions._id}
                  type={suggestions.type}
                  username={suggestions.username}
                  name={suggestions.name}
                  description={suggestions.description}
                  suggestionObj={suggestions}
              />)}
            </Item.Group>
          </Grid.Column>
        </Grid>
    );
  }
}

ListSuggestionsWidget.propTypes = {
  suggestions: PropTypes.array.isRequired,
  // ready: PropTypes.bool.isRequired,

};

export default withTracker(() =>
    /*
    const subscriptionChallenges = DeveloperChallenges.subscribe();
    const subscriptionSkills = DeveloperSkills.subscribe();
    const subscriptionTools = DeveloperTools.subscribe();
    const subscriptionDevelopers = Developers.subscribe();
    const subscriptionTeam = Teams.subscribe();
    const subSkills = Skills.subscribe();
    const subChallenges = Challenges.subscribe();
    const subTools = Tools.subscribe();
     */

    // eslint-disable-next-line implicit-arrow-linebreak
    ({
      suggestions: Suggestions.find({}).fetch(),
      // eslint-disable-next-line max-len
      /*
      ready: subscriptionChallenges.ready() && subscriptionSkills.ready() && subscriptionTools.ready()
          && subscriptionDevelopers.ready() && subscriptionTeam.ready() && subSkills.ready() && subTools.ready()
          && subChallenges.ready(),
       */
    }))(ListSuggestionsWidget);
