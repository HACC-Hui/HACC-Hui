import React from 'react';
import { Grid, Image } from 'semantic-ui-react';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class Landing extends React.Component {
  render() {
    return (
        <Grid verticalAlign='middle' textAlign='center' container>

          <Grid.Column width={4}>
            <Image size='massive' circular src="/images/Combined-Logos.png"/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Welcome to HACC-Hui</h1>
            <p>Please sign in or register with slack bot if you haven't yet.</p>
          </Grid.Column>

        </Grid>
    );
  }
}

export default Landing;
