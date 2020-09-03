import React from 'react';
import { Image, Header, Button, Icon } from 'semantic-ui-react';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class Landing extends React.Component {
  render() {
    return (
        <div style={{ backgroundColor: '#393B44' }}>
          <div align={'center'}>
            <Image src='images/hacc-logo.png'/>
          </div>
          <div align={'center'} style={{ backgroundColor: '#24252B' }}>
            <Header inverted style={{ padding: '5rem 10rem 5rem 10rem' }} as={'h2'}>
              The HACC Hui system provides an easy-to-use system that simplifies and improves the
              team formation process for the Hawaii Annual Code Challenge.
            </Header>
          </div>

          <div align={'center'} style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <Header as='h1' inverted>
              <Icon name='address card outline' style={{ color: 'white', fontSize: '5.5em' }}/>
              <Header.Content>
                CREATE A PROFILE
                <Header.Subheader>Let others know who you are and what you know</Header.Subheader>
              </Header.Content>
            </Header>

            <Header as='h1' inverted>
              <Icon name='users' style={{ color: 'white', fontSize: '5.5em' }}/>
              <Header.Content>
                CREATE OR FIND A TEAM
                <Header.Subheader>Link up with others around the state</Header.Subheader>
              </Header.Content>
            </Header>

            <Header as='h1' inverted>
              <Icon name='slack' style={{ color: 'white', fontSize: '5.5em' }}/>
              <Header.Content>
                SLACK
                <Header.Subheader>Usage of a Slack bot to improve team formation &
                  communication</Header.Subheader>
              </Header.Content>
            </Header>
            <Button style={{ color: 'white', backgroundColor: '#24252B' }}>Sign Up</Button>

          </div>
        </div>
    );
  }
}

export default Landing;
