// /shop.c4ei.net/frontend/src/components/Admin/HistoryAdmin.js
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import Pagination from '@mui/material/Pagination';
import dayjs from 'dayjs'; // 날짜 포맷팅을 위한 라이브러리

export default function HistoryAdmin() {
  const [histories, setHistories] = useState([]);
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [updatedDelivery, setUpdatedDelivery] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // 검색에 사용될 상태 추가
  const [totalPages, setTotalPages] = useState(1);

  // 히스토리 데이터를 서버에서 불러오는 함수
  const fetchHistories = async (searchTerm, pageNumber) => {
    try {
      const response = await axios.get('/api/history', {
        params: {
          search: searchTerm,
          page: pageNumber,
        },
      });
      setHistories(response.data.data);
      // 서버에서 반환한 총 히스토리 수를 이용해 페이지 수 계산
      setTotalPages(Math.ceil(response.data.total / 15));
    } catch (err) {
      console.error('히스토리 데이터를 불러오는 중 오류 발생:', err);
    }
  };

  // 검색어 또는 페이지 변경 시 히스토리 데이터를 다시 불러옴
  useEffect(() => {
    fetchHistories(searchQuery, page);
  }, [searchQuery, page]);

  // 검색어 입력 핸들러
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // 검색 버튼 클릭 핸들러
  const handleSearchClick = () => {
    setSearchQuery(search); // 검색어 상태 업데이트
    setPage(1); // 검색 시 첫 페이지로 이동
  };

  // 페이지 변경 핸들러
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleViewClick = (history) => {
    setSelectedHistory(history);
    setUpdatedDelivery(history.delivery);
    setUpdatedStatus(history.status);
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    const updatedHistory = {
      ...selectedHistory,
      delivery: updatedDelivery,
      status: updatedStatus,
    };

    try {
      await axios.put(`/api/history/${updatedHistory.id}`, updatedHistory);
      setShowModal(false);
      fetchHistories(searchQuery, page); // 변경된 후 히스토리 목록 갱신
    } catch (error) {
      console.error("Error updating history:", error);
    }
  };
  // formatDate 함수 추가
  const formatDate = (dateString) => {
    return dayjs(dateString).format('YY.MM.DD HH:mm');
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
                
                {/* 검색어 입력 필드 */}
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="검색어를 입력하세요"
                />

                {/* 검색 버튼 */}
                <button
                  className="btn btn-primary"
                  onClick={handleSearchClick}
                >
                  검색
                </button>

                <br />
                <div className="table-responsive">
                  <table className="table table-striped table-bordered no-wrap">
                    <thead>
                      <tr>
                        <th>ID User</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Created At</th>
                        <th>Total</th>
                        <th>Delivery</th>
                        <th>Status</th>
                        <th>Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {histories.map((item, index) => (
                        <tr key={index}>
                          <td>{item.idUser}</td>
                          <td>{item.fullname}</td>
                          <td>{item.phone}</td>
                          <td>{item.address}</td>
                          <td>{formatDate(item.createdAt)}</td>
                          <td>{item.total}</td>
                          <td>{item.delivery ? "배송됨" : "미배송"}</td>
                          <td>{item.status ? "Paid" : "Unpaid"}</td>
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
                  
                  {/* 페이지네이션 */}
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
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
