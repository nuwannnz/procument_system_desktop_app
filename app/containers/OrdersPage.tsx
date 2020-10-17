/* eslint-disable react/destructuring-assignment */
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
  Tab,
  Table,
  Tabs,
} from 'react-bootstrap';
import API from '../constants/API.json';
import { selectAuthToken } from '../features/login/loginSlice';
import { RootState } from '../store';
import { getAuthHeader } from '../utils/tokenHelper';

const OrderItem = (props: {
  orderId: string;
  siteName: string;
  viewClickHandler: (orderId: string) => void;
}) => {
  return (
    <Card className="d-flex flex-row justify-content-between align-items-center p-2 m-2">
      <div>
        <span className="mr-5">{props.orderId}</span>
        <span className="ml-5">{props.siteName}</span>
      </div>
      <Button
        onClick={() => props.viewClickHandler(props.orderId)}
        size="sm"
        variant="info"
      >
        View
      </Button>
    </Card>
  );
};

export default function OrdersPage() {
  const token = useSelector((state: RootState) => selectAuthToken(state));

  const [orderList, setOrderList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [rejectMsg, setRejectMsg] = useState('');

  const [displayPendingOrderModal, setDisplayPendingOrderModal] = useState(
    false
  );
  const [selectedPendingOrder, setSelectedPendingOrder] = useState<any | null>(
    null
  );

  const [displayRejectMsgInput, setDisplayRejectMsgInput] = useState(false);

  const loadData = () => {
    (async () => {
      setIsLoading(true);
      const orderData = await axios.get(
        `${API.API_URL}/orders/`,
        getAuthHeader(token)
      );
      setOrderList(orderData.data.orders);
      setIsLoading(false);
    })();
  };

  const acceptOrder = () => {
    (async () => {
      await axios.patch(
        `${API.API_URL}/orders/status/${selectedPendingOrder.id}`,
        { state: 1 },
        getAuthHeader(token)
      );
      alert('Accepted order');
    })();
  };

  const rejectOrder = () => {
    (async () => {
      await axios.patch(
        `${API.API_URL}/orders/status/${selectedPendingOrder.id}`,
        { state: 2, approveComment: rejectMsg },
        getAuthHeader(token)
      );
      setRejectMsg('');
      setDisplayRejectMsgInput(false);
      setDisplayPendingOrderModal(false);
      alert('Rejected order');
    })();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Row>
        <Col>
          <h1>Orders</h1>
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

          <Tabs defaultActiveKey="1" id="uncontrolled-tab-example">
            <Tab eventKey="1" title="Pending">
              {orderList
                .filter((o: any) => o.state === 3)
                .map((o: any) => (
                  <OrderItem
                    key={o.id}
                    orderId={o.id}
                    siteName={o.site.name}
                    viewClickHandler={(id) => {
                      setSelectedPendingOrder(o);
                      setDisplayPendingOrderModal(true);
                    }}
                  />
                ))}
            </Tab>
            <Tab eventKey="2" title="Approved">
              {orderList
                .filter((o: any) => o.state === 1)
                .map((o: any) => (
                  <OrderItem
                    key={o.id}
                    orderId={o.id}
                    siteName={o.site.name}
                    viewClickHandler={(id) => {
                      setSelectedPendingOrder(o);
                      setDisplayPendingOrderModal(true);
                    }}
                  />
                ))}
            </Tab>
            <Tab eventKey="3" title="Rejected">
              {orderList
                .filter((o: any) => o.state === 2)
                .map((o: any) => (
                  <OrderItem
                    key={o.id}
                    orderId={o.id}
                    siteName={o.site.name}
                    viewClickHandler={(id) => {
                      setSelectedPendingOrder(o);
                      setDisplayPendingOrderModal(true);
                    }}
                  />
                ))}
            </Tab>
          </Tabs>
        </div>
      </div>

      <Modal
        show={displayPendingOrderModal}
        onHide={() => setDisplayPendingOrderModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Order request info</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col>
              <span>Site manager: </span>
            </Col>
            <Col>
              <span>
                {selectedPendingOrder ? selectedPendingOrder.owner.email : ''}
              </span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span>Goods: </span>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Quantity</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPendingOrder &&
                    selectedPendingOrder.items.map((i: any) => (
                      <tr key={i.id}>
                        <td>{i.order_item.qty}</td>
                        <td>{i.name}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Col>
          </Row>

          <Row>
            <Col>
              <span>Delivery Date: </span>
            </Col>
            <Col>
              <span>
                {selectedPendingOrder ? selectedPendingOrder.deliveryDate : ''}
              </span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span>Supplier: </span>
            </Col>
            <Col>
              <span>
                {selectedPendingOrder
                  ? selectedPendingOrder.supplier.email
                  : ''}
              </span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span>Site: </span>
            </Col>
            <Col>
              <span>
                {selectedPendingOrder ? selectedPendingOrder.site.name : ''}
              </span>
            </Col>
          </Row>
          {displayRejectMsgInput && (
            <Row>
              <Col>
                <Form.Group controlId="email">
                  <Form.Label>Reject message</Form.Label>
                  <Form.Control
                    onChange={(e) => setRejectMsg(e.target.value)}
                    value={rejectMsg}
                    type="text"
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          {selectedPendingOrder && selectedPendingOrder.state === 2 && (
            <Alert variant="danger">
              {selectedPendingOrder.approveComment}
            </Alert>
          )}
        </Modal.Body>
        {selectedPendingOrder && selectedPendingOrder.state === 3 && (
          <Modal.Footer>
            <Button variant="primary" onClick={() => acceptOrder()}>
              Accept
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (displayRejectMsgInput) {
                  rejectOrder();
                } else {
                  setDisplayRejectMsgInput(true);
                }
              }}
            >
              Reject
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDisplayPendingOrderModal(false)}
            >
              Cancel
            </Button>
          </Modal.Footer>
        )}
        {selectedPendingOrder && selectedPendingOrder.state === 1 && (
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setDisplayPendingOrderModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        )}
        {selectedPendingOrder && selectedPendingOrder.state === 2 && (
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setDisplayPendingOrderModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
}
