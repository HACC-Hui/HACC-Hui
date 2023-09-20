import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import Container from 'react-bootstrap/Container';

import { Teams } from '../../../api/team/TeamCollection';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListTeamsTableWidget from '../../components/participant/ListTeamsTableWidget';

const ListTeamsPage = () => {
  const { ready, teams } = useTracker(() => {
    const teamsSub = Teams.subscribe();
    const teamDocs = Teams.find({}).fetch();

    return {
      ready: teamsSub.ready(),
      teams: teamDocs,
    };
  }, []);

  return (
    <Container id="list-teams-page" style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>All Teams</h1>
      {ready ? <ListTeamsTableWidget teams={teams} /> : undefined}
    </Container>
  );
};

export default withAllSubscriptions(ListTeamsPage);
