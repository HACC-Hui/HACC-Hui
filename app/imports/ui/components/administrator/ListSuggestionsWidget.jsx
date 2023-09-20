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
import { withTracker } from 'meteor/react-meteor-data';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';
import ListSuggestionsCard from './ListSuggestionsCard';
import ListSuggestionsFilter from './ListSuggestionsFilter';
import SuggestToolSkillWidgetAdmin from '../../components/administrator/SuggestToolSkillWidgetAdmin';

class ListSuggestionsWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      type: [],
      result: this.props.suggestions.slice().sort(this.compare),
    };
  }

  compare(a, b) {
    return a.name.localeCompare(b.name);
  }

  componentWillReceiveProps(nextProps) {
    // eslint-disable-next-line max-len
    if ((nextProps.suggestions.slice().sort(this.compare)) !== (this.props.suggestions.slice().sort(this.compare))) {
      this.setState({
        result: nextProps.suggestions.slice().sort(this.compare),
      });
    }
  }

  render() {
    if (this.props.suggestions.length === 0) {
      return (
          <div align={'center'}>
            <Header as='h2' icon>
              <Icon name='users' />
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
    };

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

    // console.log(this.props.suggestions);

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
              <div style={{ paddingTop: '2rem' }}>
                <SuggestToolSkillWidgetAdmin />
              </div>
            </Segment>
          </Grid.Column>
          <Grid.Column width={12}>
            <Item.Group divided>
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
};

export default withTracker(() => ({
  suggestions: Suggestions.find({}).fetch(),
}))(ListSuggestionsWidget);
