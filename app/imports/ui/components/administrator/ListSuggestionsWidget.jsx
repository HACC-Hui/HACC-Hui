import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Card,
} from 'react-bootstrap';
import { FaUsers, FaSearch } from 'react-icons/fa';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';
import Dropdown from '../Dropdown';
import ListSuggestionsCard from './ListSuggestionsCard';
import ListSuggestionsFilter from './ListSuggestionsFilter';
import SuggestToolSkillWidgetAdmin from '../../components/administrator/SuggestToolSkillWidgetAdmin';

const ListSuggestionsWidget = ({ suggestions }) => {
  if (suggestions.length === 0) {
    return (
      <Container align={'center'} id="list-suggestions-page">
        <Row>
          <Col> <FaUsers size={200} /></Col>
        </Row>
        <Row>
          <Col as='h1'>There are no suggestions at the moment.</Col>
        </Row>
        <Row>
          <Col as='h2'>Please check back later.</Col>
        </Row>
      </Container>
    );
  }

  const [search, setSearch] = useState('');
  const [type, setType] = useState([]);
  const compare = (a, b) => a.name.localeCompare(b.name);
  const [result, setResult] = useState(suggestions.slice().sort(compare));

  useEffect(() => {
    if (result !== suggestions.slice().sort(compare)) {
      setResult(suggestions.slice().sort(compare));
    }
  }, [suggestions]);

  const filters = new ListSuggestionsFilter();

  const setFilters = () => {
    const searchResults = filters.filterBySearch(suggestions, search);
    const typeResults = filters.typeResults(searchResults, type);
    const sorted = filters.sortBy(typeResults, 'names');
    setResult(sorted);
  };

  useEffect(() => {
    setFilters();
  }, [type]);

  useEffect(() => {
    setFilters();
  }, [search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const getType = (value) => {
    setType(value);
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

  return (
      <Container
        id="list-suggestions-page"
        style={{ paddingBottom: '4rem' }}
      >
        <Row align={'center'} as={'h1'}>
          <div style={{ paddingTop: '2rem' }}>
            Suggestions
          </div>
        </Row>
        <Row>
          <Col xs={3}>
            <Card border="secondary" style={{ width: '18rem' }}>
              <Card.Body>
                <Row as={'h2'}>
                  <div style={{ paddingTop: '2rem' }}>
                    Total Suggestions: {result.length}
                  </div>
                  <div style={{ paddingTop: '1rem' }}>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control type='text'
                        name='search'
                        placeholder='Search...'
                        onChange={handleSearchChange}
                      />
                    </InputGroup>
                  </div>
                </Row>
                <Row>
                  <div style={{ paddingTop: '2rem' }}>
                    <h2>Suggestion Types</h2>
                    <Dropdown
                      items={typeOptions}
                      onItemSelect={getType}
                      label="Types"
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#000000',
                      }}/>
                  </div>
                </Row>
                <Row>
                  <div style={{ paddingTop: '2rem' }}>
                    <SuggestToolSkillWidgetAdmin />
                  </div>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col width={12}>
            <ListGroup>
              {result.map((suggestion) => <ListSuggestionsCard
                key={suggestion._id}
                type={suggestion.type}
                username={suggestion.username}
                name={suggestion.name}
                description={suggestion.description}
                suggestionObj={suggestion}
              />)}
            </ListGroup>
          </Col>
        </Row>
      </Container>
  );
};

ListSuggestionsWidget.propTypes = {
  suggestions: PropTypes.array.isRequired,
};

export default withTracker(() => ({
  suggestions: Suggestions.find({}).fetch(),
}))(ListSuggestionsWidget);
