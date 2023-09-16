import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, useLocation } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Participants } from '../../api/user/ParticipantCollection';
import { ROUTES } from '../../startup/client/route-constants';

/** @type { React.FC<{}> } */
const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  /** @type {React.FormEventHandler<HTMLFormElement>} */
  const handleSubmit = (e) => {
    e.preventDefault();

    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason);
        return;
      }

      setError('');
      setRedirectToReferrer(true);
    });
  };

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

  const location = useLocation();

  const { from } = location.state || { from: { pathname } };
  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <Container id="signin-page">
      <Row className="justify-content-center align-items-center">
        <Col md={6}>
          <h2
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            Login to your account
          </h2>
          <Form
            onSubmit={handleSubmit}
            style={{
              display: 'grid',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Form.Group
              style={{
                marginBottom: 10,
              }}
            >
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaEnvelope />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="E-mail address"
                  value={email}
                  onChange={handleChangeEmail}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleChangePassword}
                />
              </InputGroup>
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              style={{
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              Submit
            </Button>
          </Form>
          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <strong>Login was not successful</strong>
              <p>{error}</p>
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

Signin.propTypes = {
  location: PropTypes.object,
};

export default Signin;
