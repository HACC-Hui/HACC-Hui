import React from 'react';
import { Container } from 'react-bootstrap';

/**
 * The Footer appears at the bottom of every page. Rendered by the App Layout component.
 * @memberOf ui/components
 */
const Footer = () => {
  return (
    <footer id="footer">
      <Container className="text-center">
        Department of Information and Computer Sciences
        <br />
        University of Hawaii
        <br />
        Honolulu, HI 96822
        <br />
        <a href="http://HACC-Hui.github.io">HACC-Hui Home Page</a>
      </Container>
    </footer>
  );
};

export default Footer;
