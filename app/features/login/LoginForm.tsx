import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState } from '../../store';
import { selectIsLoading, selectAuthToken, loginAsync } from './loginSlice';
import routes from '../../constants/routes.json';

export default function LoginForm() {
  const dispatch = useDispatch();
  const history = useHistory();

  const isLoading = useSelector((state: RootState) => selectIsLoading(state));
  const authToken = useSelector((state: RootState) => selectAuthToken(state));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = () => {
    dispatch(loginAsync(email, password));
  };

  useEffect(() => {
    if (authToken.length > 0) {
      // logged in
      history.push(routes.DASHBOARD);
    }
  }, [authToken]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div style={{ width: '400px' }}>
        <div
          className="p-3"
          style={{ backgroundColor: '#fff', borderRadius: '10px' }}
        >
          <Row>
            <Col>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="text"
                  placeholder="Enter email here"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="Enter password here"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button onClick={() => handleLoginClick()} disabled={isLoading}>
                Login
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
