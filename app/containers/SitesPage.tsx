/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from 'react-bootstrap';
import API from '../constants/API.json';
import { selectAuthToken } from '../features/login/loginSlice';
import { RootState } from '../store';
import { getAuthHeader } from '../utils/tokenHelper';

export default function SitesPage() {
  const token = useSelector((state: RootState) => selectAuthToken(state));

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [displaySupplierDialog, setDisplaySupplierDialog] = useState(false);

  const [siteList, setSiteList] = useState<any[]>([]);
  const [siteName, setSiteName] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [selectedSite, setSelectedSite] = useState<any | null>(null);

  const [selectedSupplierId, setSelectedSupplierId] = useState(-1);

  const [supplierList, setSupplierList] = useState([]);

  const loadData = () => {
    (async () => {
      setIsLoading(true);
      const sitesData = await axios.get(
        `${API.API_URL}/sites/`,
        getAuthHeader(token)
      );
      setSiteList(sitesData.data.sites);
      setIsLoading(false);
      if (selectedSite) {
        setSelectedSite(siteList.find((s: any) => s.id === selectedSite.id));
      }
    })();
  };

  const handleCreate = () => {
    (async () => {
      setIsSaving(true);
      await axios.post(
        `${API.API_URL}/sites/`,
        {
          name: siteName,
          address: siteAddress,
        },
        getAuthHeader(token)
      );

      loadData();
      setDisplayDialog(false);
      setSiteAddress('');
      setSiteName('');

      setIsSaving(false);
    })();
  };

  const handleAddSupplierToSite = () => {
    (async () => {
      await axios.patch(
        `${API.API_URL}/sites/supplier/${selectedSite.id}`,
        { supplierId: selectedSupplierId },
        getAuthHeader(token)
      );
      loadData();
    })();
  };

  const handleRemoveSupplierFromSite = (supplierId: number) => {
    (async () => {
      await axios.delete(
        `${API.API_URL}/sites/${selectedSite.id}/supplier/${supplierId}`,
        getAuthHeader(token)
      );
      loadData();
    })();
  };

  const deleteSite = (siteId: number) => {
    if (!confirm('Delete this site?')) {
      return;
    }
    (async () => {
      await axios.delete(
        `${API.API_URL}/sites/${siteId}`,
        getAuthHeader(token)
      );
      loadData();
    })();
  };

  const loadSuppliers = () => {
    (async () => {
      const userData = await axios.get(
        `${API.API_URL}/users/`,
        getAuthHeader(token)
      );
      setSupplierList(userData.data.users.filter((u: any) => u.userRole === 5));
    })();
  };

  useEffect(() => {
    loadSuppliers();
    loadData();
  }, []);

  return (
    <div>
      <Row>
        <Col className="d-flex align-items-center">
          <h1>Sites</h1>
          <Button
            className="ml-3"
            size="sm"
            onClick={() => setDisplayDialog(true)}
          >
            Add new site
          </Button>
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
          <Row>
            <Col className="mb-3">
              {isLoading && (
                <Alert variant="info">
                  <span>Loading...</span>
                </Alert>
              )}
            </Col>
          </Row>

          <Row>
            <Table>
              <thead>
                <tr>
                  <th>Site id</th>
                  <th>Site name</th>
                  <th>Site address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {siteList.map((s: any) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.address}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="info"
                        className="mr-1"
                        onClick={() => {
                          setSelectedSite(s);
                          setDisplaySupplierDialog(true);
                        }}
                      >
                        Add suppliers
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteSite(s.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </div>
      </div>

      <Modal
        show={displayDialog}
        onHide={() => setDisplayDialog(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add new site</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col className="mb-3">
              <Form.Group controlId="email">
                <Form.Label>Site name</Form.Label>
                <Form.Control
                  onChange={(e) => setSiteName(e.target.value)}
                  value={siteName}
                  type="text"
                />
              </Form.Group>
            </Col>
            <Col className="mb-3">
              <Form.Group controlId="email">
                <Form.Label>Site address</Form.Label>
                <Form.Control
                  onChange={(e) => setSiteAddress(e.target.value)}
                  value={siteAddress}
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {isSaving && (
              <Alert variant="success">
                <span>Saving...</span>
              </Alert>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDisplayDialog(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleCreate();
            }}
          >
            create
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={displaySupplierDialog}
        onHide={() => setDisplaySupplierDialog(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Suppliers of {selectedSite ? selectedSite.name : ''}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col className="col-8 mb-3">
              <Form inline>
                <Form.Group controlId="email">
                  <Form.Label>Select new Suppliers</Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      setSelectedSupplierId(parseInt(e.target.value, 10));
                    }}
                    value={selectedSupplierId}
                    as="select"
                  >
                    <option value={-1}>Select a supplier</option>
                    {supplierList.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.email}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form>
            </Col>
            <Col>
              <Button
                variant="success"
                size="sm"
                disabled={selectedSupplierId === -1}
                onClick={() => {
                  handleAddSupplierToSite();
                }}
              >
                Add
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>
              {selectedSite &&
                selectedSite.users.map((u: any) => (
                  <Card className="d-inline-block p-2" key={u.id}>
                    <div className="d-flex align-items-center">
                      <span>{u.email}</span>
                      <Button
                        variant="light"
                        size="sm"
                        className="ml-3"
                        onClick={() => handleRemoveSupplierFromSite(u.id)}
                      >
                        X
                      </Button>
                    </div>
                  </Card>
                ))}
            </Col>
          </Row>
          <Row>
            {isSaving && (
              <Alert variant="success">
                <span>Saving...</span>
              </Alert>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDisplaySupplierDialog(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
