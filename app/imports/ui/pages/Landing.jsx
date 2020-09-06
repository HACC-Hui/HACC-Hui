import React from 'react';
import { Responsive, Grid, Image, Container, Header, Button, Icon, Segment } from 'semantic-ui-react';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class Landing extends React.Component {
  state = {
    log: [],
    logCount: 0,
  }

  handleOnUpdate = (e) => {
    this.setState((prevState) => ({
      log: [
        `${new Date().toLocaleTimeString()}: onUpdate()`,
        ...prevState.log,
      ].slice(0, 20),
      logCount: prevState.logCount + 1,
    }));
    console.log(`e.currentTarget.innerWidth = ${e.currentTarget.innerWidth}`);
    // eslint-disable-next-line no-undef
    console.log(`window.innerWidth = ${window.innerWidth}`);

  }

  render() {
    return (
        <Responsive
            as={Segment}
            onUpdate={this.handleOnUpdate}
            textAlign='center'
            style={{ minHeight: 700, padding: '1em 0em' }}
            vertical
        >
          <Container text>
            <Header
                as='h1'
                content='Imagine-a-Company'
                style={{
                  fontSize: (window.innerwidth > 750) ? '4em' : '2em',
                  fontWeight: 'normal',
                  marginBottom: 0,
                  marginTop: (window.innerwidth > 750) ? '4em' : '2em',
                }}
            />
            <Header
                as='h2'
                content='Do whatever you want when you want to.'
                style={{
                  fontSize: '1.7em',
                  fontWeight: 'normal',
                  marginTop: '1.5em',
                }}
            />
            <Button primary size='huge'>
              Get Started
              <Icon name='right arrow' />
            </Button>
          </Container>
        </Responsive>
        // <Grid stackable centered >
        //     <Grid.Column>blash
        //       <Image size='medium' circular src="/images/meteor-logo.png"/>weqrqwe
        //     </Grid.Column>
        //
        //   <Grid.Row centered columns={3}>
        //     <Grid.Column>
        //       <Image size='small' circular src="/images/meteor-logo.png"/>
        //       adfasdfasd
        //     </Grid.Column>
        //     <Grid.Column>
        //       <Image size='small' circular src="/images/meteor-logo.png"/>yteherhyehrt
        //     </Grid.Column>
        //     <Grid.Column>
        //       <Image size='small' circular src="/images/meteor-logo.png"/>ertyeyt
        //     </Grid.Column>
        //   </Grid.Row>
        // </Grid>



        // <Grid verticalAlign='middle' textAlign='center' container>
        //
        //   <Grid.Column width={4}>
        //     <Image size='small' circular src="/images/meteor-logo.png"/>
        //   </Grid.Column>
        //
        //   <Grid.Column width={8}>
        //     <h1>Welcome to this template</h1>
        //     <p>Now get </p>
        //   </Grid.Column>
        //
        // </Grid>
    );
  }
}

export default Landing;
