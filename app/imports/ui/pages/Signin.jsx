import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Form, Button, Container, Row, Alert, Col } from 'react-bootstrap';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { Participants } from '../../api/user/ParticipantCollection';
import { ROUTES } from '../../startup/client/route-constants';

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', redirectToReferer: false, role: '' };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

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
      }
    });
  }

  render() {
    let pathname = ROUTES.LANDING;
    if (Participants.isDefined(Meteor.userId())) {
      const dev = Participants.findDoc({ userID: Meteor.userId() });
      if (dev.isCompliant) {
        if (dev.editedProfile) {
          pathname = ROUTES.LANDING;
        } else {
          pathname = ROUTES.CREATE_PROFILE;
        }
      } else {
        pathname = ROUTES.AGE_CONSENT;
      }
    }
    const { from } = this.props.location.state || { from: { pathname } };

    if (this.state.redirectToReferer) {
      return <Redirect to={from} />;
    }

    return (

        <Container>
          <Row className="justify-content-center align-items-center">
            <Col md={6}>
              <h2 style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center' }}>
                Login to your account</h2>
              <Form onSubmit={this.submit}
                    style={{
                      display: 'grid',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
              >
                <Form.Group style={{
                  marginBottom: 10,
                }}>
                  <Form.Label>Email</Form.Label>
                  <div className="input-group" >
                    <div className="input-group-prepend">
                      <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                    </div>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="E-mail address"
                        onChange={this.handleChange}
                    />
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"><i className="fas fa-lock"></i></span>
                    </div>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={this.handleChange}
                    />
                  </div>
                </Form.Group>
                <Button type="submit" variant="primary" style={{
                  marginTop: 20,
                  marginBottom: 10,
                   }}>Submit</Button>
              </Form>
              {this.state.error === '' ? (
                  ''
              ) : (
                  <Alert variant="danger">
                    <strong>Login was not successful</strong>
                    <p>{this.state.error}</p>
                  </Alert>
              )}
            </Col>
          </Row>
        </Container>
    );
  }
}

Signin.propTypes = {
  location: PropTypes.object,
};

export default Signin;
