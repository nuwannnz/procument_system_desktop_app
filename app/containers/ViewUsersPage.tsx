/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Alert,
  Button,
  Col,
  Form,
  Row,
  Tab,
  Table,
  Tabs,
} from 'react-bootstrap';
import API from '../constants/API.json';
import { selectAuthToken } from '../features/login/loginSlice';
import { RootState } from '../store';
import { getAuthHeader } from '../utils/tokenHelper';

export default function ViewUsersPage() {
  const token = useSelector((state: RootState) => selectAuthToken(state));

  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // const handleSave = () => {
  //   (async () => {
  //     setIsSaving(true);
  //     await axios.patch(
  //       `${API.API_URL}/budgets/month`,
  //       {
  //         value: monthlyLimit,
  //       },
  //       getAuthHeader(token)
  //     );
  //     await axios.patch(
  //       `${API.API_URL}/budgets/bill`,
  //       {
  //         value: userList,
  //       },
  //       getAuthHeader(token)
  //     );
  //     setIsSaving(false);
  //   })();
  // };

  const loadData = () => {
    (async () => {
      setIsLoading(true);
      const userData = await axios.get(
        `${API.API_URL}/users/`,
        getAuthHeader(token)
      );
      setUserList(userData.data.users);
      setIsLoading(false);
    })();
  };

  const deleteUser = (userId: number) => {
    if (!confirm('Delete user permanently?')) {
      return;
    }
    (async () => {
      await axios.delete(
        `${API.API_URL}/users/${userId}`,
        getAuthHeader(token)
      );
      loadData();
    })();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Row>
        <Col>
          <h1>
            Users
            {isLoading && (
              <Alert variant="info">
                <span>Loading...</span>
              </Alert>
            )}
          </h1>
        </Col>
      </Row>
      <div className="d-flex justify-content-center mt-5">
        <div
          className="w-100 p-4"
          style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            alignSelf: 'center',
          }}
        >
          <Tabs defaultActiveKey="managers" id="uncontrolled-tab-example">
            <Tab eventKey="1" title="Managers">
              <Table>
                <thead>
                  <tr>
                    <th>Manager id</th>
                    <th>Manager email</th>
                    <th>Manager password</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userList
                    .filter((u: any) => u.userRole === 2)
                    .map((u: any) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.email}</td>
                        <td>{u.password}</td>
                        <td>
                          <Button size="sm" variant="success">
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => deleteUser(u.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="2" title="Procurement staff">
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Staff id</th>
                    <th>Staff email</th>
                    <th>Staff password</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userList
                    .filter((u: any) => u.userRole === 3)
                    .map((u: any) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.email}</td>
                        <td>{u.password}</td>
                        <td>
                          <Button size="sm" variant="success">
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => deleteUser(u.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="3" title="Site managers">
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Site Manager id</th>
                    <th>Site Manager email</th>
                    <th>Site Manager password</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userList
                    .filter((u: any) => u.userRole === 4)
                    .map((u: any) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.email}</td>
                        <td>{u.password}</td>
                        <td>
                          <Button size="sm" variant="success">
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => deleteUser(u.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="4" title="Suppliers">
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Supplier id</th>
                    <th>Supplier email</th>
                    <th>Supplier password</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userList
                    .filter((u: any) => u.userRole === 5)
                    .map((u: any) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.email}</td>
                        <td>{u.password}</td>
                        <td>
                          <Button size="sm" variant="success">
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => deleteUser(u.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
