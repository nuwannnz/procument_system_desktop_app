import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import API from '../constants/API.json';
import { selectAuthToken } from '../features/login/loginSlice';
import { RootState } from '../store';
import { getAuthHeader } from '../utils/tokenHelper';

export default function CreateUsersPage() {
  const token = useSelector((state: RootState) => selectAuthToken(state));

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [displaySuccessMsg, setDisplaySuccessMsg] = useState(false);

  const handleCreateUser = () => {
    (async () => {
      setIsSaving(true);
      const result = await axios.post(
        `${API.API_URL}/users`,
        {
          email,
          password,
          role,
        },
        getAuthHeader(token)
      );
      if (result.data.status) {
        setDisplaySuccessMsg(true);
        setTimeout(() => {
          setDisplaySuccessMsg(false);
        }, 2000);
      }
      setIsSaving(false);
    })();
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Add new user</h1>
        </Col>
      </Row>
      <div className="d-flex justify-content-center mt-5">
        <div
          className="w-50 p-4"
          style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            alignSelf: 'center',
          }}
        >
          <Row>
            <Col className="mb-3">
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className="mb-3">
              <Form.Group controlId="email">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className="mb-3">
              <Form.Group controlId="email">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  onChange={(e) => setRole(parseInt(e.target.value, 10))}
                  value={role}
                  as="select"
                >
                  <option value={2}>Manager</option>
                  <option value={3}>Procurement staff</option>
                  <option value={4}>Site manager</option>
                  <option value={5}>Supplier</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col className="mb-3">
              {isSaving && (
                <Alert variant="info">
                  <span>Creating user...</span>
                </Alert>
              )}
              {displaySuccessMsg && (
                <Alert variant="success">
                  <span>Created user</span>
                </Alert>
              )}

              <Button
                className="mt-3"
                variant="success"
                onClick={() => handleCreateUser()}
              >
                Create
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
