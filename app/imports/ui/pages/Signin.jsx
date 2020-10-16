import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Container, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { Participants } from '../../api/user/ParticipantCollection';
import { ROUTES } from '../../startup/client/route-constants';

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 * @memberOf ui/pages
 */
class Signin extends React.Component {

  /** Initialize component state with properties for login and redirection.
   * @param props {Object} the properties.
   */
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', redirectToReferer: false, role: '' };
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  /** Handle Signin submission using Meteor's account mechanism. */
  submit = () => {
    const { email, password } = this.state;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        this.setState({ error: err.reason });
      } else {
        let role = ROLE.PARTICIPANT;
        if (Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN)) {
          role = ROLE.ADMIN;
        }
        this.setState({ error: '', redirectToReferer: true, role: role });
        // console.log('admin', Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN));
      }
    });
  }

  // Render the signin form.
  render() {
    // console.log(this.state);
    let pathname = ROUTES.LANDING;
    if (Participants.isDefined(Meteor.userId())) {
      const dev = Participants.findDoc({ userID: Meteor.userId() });
      // console.log(dev);
      if (dev.isCompliant) {
        pathname = ROUTES.CREATE_PROFILE;
      } else {
        pathname = ROUTES.AGE_CONSENT;
      }
    }
    const { from } = this.props.location.state || { from: { pathname } };
    // if correct authentication, redirect to page instead of login screen
    if (this.state.redirectToReferer) {
      return <Redirect to={from}/>;
    }
    // Otherwise return the Login form.
    return (
      <Container>
        <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
          <Grid.Column>
            <Header as="h2" textAlign="center">
              Login to your account
            </Header>
            <Form onSubmit={this.submit}>
              <Segment stacked>
                <Form.Input
                  label="Email"
                  icon="user"
                  iconPosition="left"
                  name="email"
                  type="email"
                  placeholder="E-mail address"
                  onChange={this.handleChange}
                />
                <Form.Input
                  label="Password"
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  placeholder="Password"
                  type="password"
                  onChange={this.handleChange}
                />
                <Form.Button content="Submit"/>
              </Segment>
            </Form>
            {this.state.error === '' ? (
              ''
            ) : (
              <Message
                error
                header="Login was not successful"
                content={this.state.error}
              />
            )}
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

// Ensure that the React Router location object is available in case we need to redirect.
Signin.propTypes = {
  location: PropTypes.object,
};

export default Signin;
