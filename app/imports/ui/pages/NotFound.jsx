import React from 'react';
import { Container } from 'react-bootstrap';

/**
 * Render a Not Found page if the user enters a URL that doesn't match any route.
 * @memberOf ui/pages
 */
function NotFound() {
    return (
        <Container id="not-found-page" as="h2" className="text-center">
            <p>Page not found</p>
        </Container>
    );
}

export default NotFound;
