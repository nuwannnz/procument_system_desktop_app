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

const InvoiceItem = (props: {
  invoiceId: string;
  siteName: string;
  totalPrice: number;
  viewClickHandler: (orderId: string) => void;
}) => {
  return (
    <Card className="d-flex flex-row justify-content-between align-items-center p-2 m-2">
      <div>
        <span className="mr-5">{props.invoiceId}</span>
        <span className="ml-5">{props.siteName}</span>
      </div>
      <span>
        Rs.
        {props.totalPrice}
      </span>
      <Button
        onClick={() => props.viewClickHandler(props.invoiceId)}
        size="sm"
        variant="info"
      >
        View
      </Button>
    </Card>
  );
};

export default function InvoicePage() {
  const token = useSelector((state: RootState) => selectAuthToken(state));

  const [invoiceList, setInvoiceList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [displayInvoiceModal, setDisplayInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const loadData = () => {
    (async () => {
      setIsLoading(true);
      const invoiceData = await axios.get(
        `${API.API_URL}/invoice/`,
        getAuthHeader(token)
      );
      setInvoiceList(invoiceData.data.invoices);
      setIsLoading(false);
    })();
  };

  const payInvoice = () => {
    (async () => {
      await axios.patch(
        `${API.API_URL}/invoice/pay/${selectedInvoice.id}`,
        {},
        getAuthHeader(token)
      );
      setDisplayInvoiceModal(false);
      loadData();
      alert('Payed order');
    })();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Row>
        <Col>
          <h1>Invoices</h1>
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
              {invoiceList
                .filter((o: any) => !o.payed)
                .map((o: any) => (
                  <InvoiceItem
                    key={o.id}
                    invoiceId={o.id}
                    siteName={o.order.site.name}
                    totalPrice={o.totalValue}
                    viewClickHandler={(id) => {
                      setSelectedInvoice(o);
                      setDisplayInvoiceModal(true);
                    }}
                  />
                ))}
            </Tab>
            <Tab eventKey="2" title="Payed">
              {invoiceList
                .filter((o: any) => o.payed)
                .map((o: any) => (
                  <InvoiceItem
                    key={o.id}
                    invoiceId={o.id}
                    siteName={o.order.site.name}
                    totalPrice={o.totalValue}
                    viewClickHandler={(id) => {
                      setSelectedInvoice(o);
                      setDisplayInvoiceModal(true);
                    }}
                  />
                ))}
            </Tab>
          </Tabs>
        </div>
      </div>

      <Modal
        show={displayInvoiceModal}
        onHide={() => setDisplayInvoiceModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Invoice info</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col>
              <span>Site manager: </span>
            </Col>
            <Col>
              <span>{selectedInvoice ? selectedInvoice.owner.email : ''}</span>
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
                  {selectedInvoice &&
                    selectedInvoice.order.items.map((i: any) => (
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
                {selectedInvoice ? selectedInvoice.order.deliveryDate : ''}
              </span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span>Supplier: </span>
            </Col>
            <Col>
              <span>
                {selectedInvoice ? selectedInvoice.order.supplier.email : ''}
              </span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span>Site: </span>
            </Col>
            <Col>
              <span>
                {selectedInvoice ? selectedInvoice.order.site.name : ''}
              </span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span>Total: </span>
            </Col>
            <Col>
              <span className="text-bold">
                Rs.
                {selectedInvoice ? selectedInvoice.totalValue : ''}
              </span>
            </Col>
          </Row>
        </Modal.Body>

        {selectedInvoice && !selectedInvoice.payed && (
          <Modal.Footer>
            <Button variant="success" onClick={() => payInvoice()}>
              Pay
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDisplayInvoiceModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        )}
        {selectedInvoice && selectedInvoice.payed && (
          <Modal.Footer>
            {selectedInvoice && selectedInvoice.payed && (
              <Alert variant="success">Payed </Alert>
            )}
            <Button
              variant="secondary"
              onClick={() => setDisplayInvoiceModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
}
