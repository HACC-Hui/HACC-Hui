import React from 'react';

/**
 * The Footer appears at the bottom of every page. Rendered by the App Layout component.
 * @memberOf ui/components
 */
class Footer extends React.Component {
  render() {
    const divStyle = {
      paddingBottom: '10px',
      paddingTop: '15px',
    };
    const footerStyle = {
      color: 'white',
      backgroundColor: '#393B44',
      borderRadius: '0',
    }
    return (
        <footer style={footerStyle}>
          <div style={divStyle} className="ui center aligned container">
            <hr />

              Department of Information and Computer Sciences <br />
              University of Hawaii<br />
              Honolulu, HI 96822 <br />
            <a href="http://HACC-Hui.github.io">HACC-Hui Home Page</a>
          </div>
        </footer>
    );
  }
}

export default Footer;
