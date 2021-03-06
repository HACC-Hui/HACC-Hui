import React from 'react';
import { footer } from '../styles';

/**
 * The Footer appears at the bottom of every page. Rendered by the App Layout component.
 * @memberOf ui/components
 */
class Footer extends React.Component {
  render() {
    return (
        <footer style={footer}>
          <div className="ui center aligned container">
             Department of Information and Computer Sciences<br />
              University of Hawaii<br />
               Honolulu, HI 96822 <br />
            <a href="http://HACC-Hui.github.io">HACC-Hui Home Page</a>
          </div>
        </footer>
    );
  }
}

export default Footer;
