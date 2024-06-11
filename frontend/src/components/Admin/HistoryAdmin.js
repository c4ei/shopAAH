import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListHistoryUser, updateHistory } from "../../services/API/historyApi"; // Assume updateHistory is an API function to update history item
import io from "socket.io-client";
import { Modal, Button, Form } from "react-bootstrap";

const socket = io("https://shop.c4ei.net");

export default function HistoryAdmin() {
  const dispatch = useDispatch();
  const { histories } = useSelector((state) => state.history?.listHistory);
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [updatedDelivery, setUpdatedDelivery] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState(false);

  useEffect(() => {
    getListHistoryUser(dispatch);
  }, [dispatch]);

  useEffect(() => {
    socket.on("receive_order", (data) => {
      setText("User ID: " + data + " AAH");

      setTimeout(() => {
        window.location.reload();
      }, 4000);
    });
  }, []);

  const handleViewClick = (history) => {
    setSelectedHistory(history);
    setUpdatedDelivery(history.delivery);
    setUpdatedStatus(history.status);
    setShowModal(true);
  };

  const handleSaveChanges = () => {
    const updatedHistory = {
      ...selectedHistory,
      delivery: updatedDelivery,
      status: updatedStatus,
    };
    updateHistory(dispatch, updatedHistory); // Call API to update history item
    setShowModal(false);
  };

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="col-7 align-self-center">
            <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
              Basic Initialisation
            </h4>
            <div className="d-flex align-items-center">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 p-0">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-muted">
                      History
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item text-muted active"
                    aria-current="page"
                  >
                    Table
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">History</h4>
                <h3>{text}</h3>
                <input
                  className="form-control w-25"
                  type="text"
                  placeholder="Enter Search!"
                />
                <br />
                <div className="table-responsive">
                  <table className="table table-striped table-bordered no-wrap">
                    <thead>
                      <tr>
                        <th>ID User</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Total</th>
                        <th>Delivery</th>
                        <th>Status</th>
                        <th>Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {histories?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.idUser}</td>
                          <td>{item.fullname}</td>
                          <td>{item.phone}</td>
                          <td>{item.address}</td>
                          <td>{item.total}</td>
                          <td>
                            {item.delivery ? "배송됨" : "미배송"}
                          </td>
                          <td>
                            {item.status ? "Paid" : "Unpaid"}
                          </td>
                          <td>
                            <a
                              style={{ cursor: "pointer", color: "white" }}
                              className="btn btn-success"
                              onClick={() => handleViewClick(item)}
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer text-center text-muted">
        <a href="https://c4ex.net">BUY AAH</a>{" "}
        <a href="https://shop.c4ei.net">AAH SHOP</a>.
      </footer>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDelivery">
              <Form.Label>Delivery</Form.Label>
              <Form.Check
                type="checkbox"
                label="Delivered"
                checked={updatedDelivery}
                onChange={(e) => setUpdatedDelivery(e.target.checked)}
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Check
                type="checkbox"
                label="Paid"
                checked={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
