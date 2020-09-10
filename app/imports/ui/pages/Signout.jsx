import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Header, Segment } from 'semantic-ui-react';

/**
 * After the user clicks the "Signout" link in the NavBar, log them out and display this page.
 * @memberOf ui/pages
 */
class Signout extends React.Component {
  render() {
    Meteor.logout();
    return (
        <div style={{ backgroundColor: '#24252B' }}>
          <div style={{ padding: '1rem 5rem', margin: '2rem 0rem' }}>
          <Segment style={{
            borderRadius: '1rem',
            backgroundColor: '#C4C4C4',
          }}>
            <Header as="h2" textAlign="center">
              <p>You are signed out.</p>
            </Header>
          </Segment>
          </div>
        </div>
    );
  }
}

export default Signout;
