import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import API from '../constants/API.json';
import { selectAuthToken } from '../features/login/loginSlice';
import { RootState } from '../store';
import { getAuthHeader } from '../utils/tokenHelper';

export default function BudgetPage() {
  const token = useSelector((state: RootState) => selectAuthToken(state));

  const [billLimit, setBillLimit] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    (async () => {
      setIsSaving(true);
      await axios.patch(
        `${API.API_URL}/budgets/month`,
        {
          value: monthlyLimit,
        },
        getAuthHeader(token)
      );
      await axios.patch(
        `${API.API_URL}/budgets/bill`,
        {
          value: billLimit,
        },
        getAuthHeader(token)
      );
      setIsSaving(false);
    })();
  };

  const loadData = () => {
    (async () => {
      setIsLoading(true);
      const budgetData = await axios.get(
        `${API.API_URL}/budgets/`,
        getAuthHeader(token)
      );
      setBillLimit(budgetData.data.billBudget);
      setMonthlyLimit(budgetData.data.monthlyBudget);
      setIsLoading(false);
    })();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Row>
        <Col>
          <h1>Budget Allocation</h1>
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
                <Form.Label>Bill limit</Form.Label>
                <Form.Control
                  onChange={(e) => setBillLimit(parseFloat(e.target.value))}
                  value={billLimit}
                  type="number"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className="mb-3">
              <Form.Group controlId="email">
                <Form.Label>Monthly limit</Form.Label>
                <Form.Control
                  onChange={(e) => setMonthlyLimit(parseFloat(e.target.value))}
                  value={monthlyLimit}
                  type="number"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col className="mb-3">
              {isLoading && (
                <Alert variant="info">
                  <span>Loading...</span>
                </Alert>
              )}

              {isSaving && (
                <Alert variant="success">
                  <span>Saving...</span>
                </Alert>
              )}

              <Button
                className="mt-3"
                variant="success"
                onClick={() => handleSave()}
              >
                Save
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
