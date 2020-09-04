import React from 'react';
import { Header } from 'semantic-ui-react';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class partf extends React.Component {
  render() {
    return (
        <div style={{ backgroundColor: '#393B44' }}>
          <div align={'center'} style={{ backgroundColor: '#24252B' }}>
            <Header inverted style={{ padding: '5rem 10rem 5rem 10rem' }} as={'h2'}>
              ParticipationForm
            </Header>
          </div>
        </div>
    );
  }
}

export default partf;
