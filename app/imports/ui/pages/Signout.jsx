import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container } from 'react-bootstrap';

/**
 * After the user clicks the "Signout" link in the NavBar, log them out and display this page.
 * @memberOf ui/pages
 */
function Signout() {
    Meteor.logout();
    return (
        <Container id="signout-page" as="h2" className="text-center">
            <p>You are signed out.</p>
        </Container>
    );
}

export default Signout;
