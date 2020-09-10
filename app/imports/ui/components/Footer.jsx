import React from 'react';

/**
 * The Footer appears at the bottom of every page. Rendered by the App Layout component.
 * @memberOf ui/components
 */
class Footer extends React.Component {
  render() {
    const divStyle = { padding: '3em 0em', color: 'white' };
    return (
        <footer style={{backgroundColor: '#303846' }}>
          <div style={divStyle} className="ui center aligned container">
              Department of Information and Computer Sciences <br />
              University of Hawaii<br />
              Honolulu, HI 96822 <br />
            <a href="http://HACC-Hui.github.io">HACC-Hui Home Page</a>
            <br/>
          </div>
        </footer>
    );
  }
}

export default Footer;
