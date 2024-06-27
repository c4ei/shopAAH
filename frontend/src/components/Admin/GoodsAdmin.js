// /shop.c4ei.net/frontend/src/components/Admin/GoodsAdmin.js
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import Pagination from "@mui/material/Pagination";
import queryString from "query-string";
import axios from "axios";
import { getListProductPanigation } from "../../services/API/goodsApi";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import add_styles from './GoodsAdmin.css';

export default function GoodsAdmin() {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 9,
    search: "",
    category: "68",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        page: pagination.page,
        size: pagination.size,
        search: pagination.search,
        category: pagination.category,
      };

      const query = queryString.stringify(params);
      const newQuery = "?" + query;
      try {
        const { products, totalProducts } = await getListProductPanigation(newQuery) || {};
        setProducts(products);
        setTotalPage(Math.ceil(totalProducts / pagination.size));
      } catch (error) {
        console.error("제품 정보를 가져오는 동안 오류가 발생했습니다:", error);
      }
    };

    fetchProducts();
  }, [pagination, dispatch]);

  const handleChangePage = (e, value) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setPage(value);
    setPagination((prev) => ({
      ...prev,
      page: value,
    }));
  };

  const handleUpdateClick = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // 삭제 기능을 여기에 추가하세요.
    console.log("ID가", id, "인 제품을 삭제합니다.");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/saveProduct', currentProduct);
      alert(response.data);
      setShowModal(false);
      // 제품 정보를 다시 가져와서 갱신
      setPagination((prev) => ({
        ...prev,
        page: 1,
      }));
    } catch (error) {
      console.error("제품 정보를 저장하는 동안 오류가 발생했습니다:", error);
      alert("제품 정보를 저장하는 동안 오류가 발생했습니다.");
    }
  };

  const handleUpdateClickID = (item) => {
    const url = `https://shop.c4ei.net/detail/${item.id}`;
    window.open(url, '_blank');
  };

  const handleCategoryClick = (category) => {
    setPagination((prev) => ({
      ...prev,
      category: category,
      page: 1, // 카테고리를 변경하면 항상 첫 페이지로 리셋
    }));
  };

  const getCategoryName = (category) => {
    switch (category) {
      case "68":
        return "건강";
      case "76":
        return "건강번들";
      case "69":
        return "가전";
      case "70":
        return "주방";
      case "71":
        return "생활";
      case "72":
        return "화장품";
      case "73":
        return "캐리어.잡화";
      case "74":
        return "캠핑";
      case "75":
        return "Watches & ACC";
      case "81":
        return "먹거리";
      case "80":
        return "전자담배";
      case "78":
        return "계절가전";
      default:
        return "Unknown category";
    }
  };

  const categories = ["68", "76", "69", "70", "71", "72", "73", "74", "75", "81", "80", "78"];

  return (
    <div className="container">
      <div className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Admin Goods</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active" aria-current="page">
                    Admin Goods
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <section className="py-5">
        <div className="container p-0">
        <div>
          <h2>카테고리 목록</h2>
          
          <a href="/GoodsAdmin">초기화</a>&nbsp;
          {categories.map((category) => (
              <Link to={`/GoodsAdmin?category=${category}`}
                style={{ marginRight: '10px' }} 
                onClick={() => handleCategoryClick(category)}
                key={category}
                >
                {getCategoryName(category)}
              </Link>
          ))}
        </div>
        <div className="row mb-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="검색어를 입력하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-primary"
                onClick={() => setPagination((prev) => ({ ...prev, search: searchQuery, page: 1 }))}
              >
                검색
              </button>
            </div>
        </div>
        

          <div className="table-responsive">
            <table className="table table-striped table-bordered no-wrap">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>상품명</th>
                  <th>가격</th>
                  <th>이미지</th>
                  <th>Category</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <a href="#" onClick={() => handleUpdateClickID(item)}>{item.id}</a>
                      </td>
                      
                      <td className={add_styles.wrapText}>{item.good_name}</td>
                      <td>₩{item.price}</td>
                      <td>
                        <img
                          src={item.img1}
                          style={{ height: "60px", width: "60px" }}
                          alt={item.img1}
                        />
                      </td>
                      <td>{item.category}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-success mx-2"
                          style={{ cursor: "pointer", color: "white" }}
                          onClick={() => handleUpdateClick(item)}
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          style={{ cursor: "pointer", color: "white" }}
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No products available</td>
                  </tr>
                )}
              </tbody>
            </table>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>제품 수정</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Row>
                    <Col md={2}>
                      <Form.Label>상품명</Form.Label>
                    </Col>
                    <Col md={10}>
                      <Form.Control
                        type="text"
                        name="good_name"
                        value={currentProduct.good_name}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                      <Form.Label>설명</Form.Label>
                    </Col>
                    <Col md={10}>
                      <Form.Control
                        type="text"
                        name="description"
                        value={currentProduct.description}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                      <Form.Label>가격</Form.Label>
                    </Col>
                    <Col md={10}>
                      <Form.Control
                        type="number"
                        name="price"
                        value={currentProduct.price}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                      <Form.Label>이미지 1</Form.Label>
                    </Col>
                    <Col md={10}>
                      <Form.Control
                        type="text"
                        name="img1"
                        value={currentProduct.img1}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                      <Form.Label>이미지 2</Form.Label>
                    </Col>
                    <Col md={10}>
                      <Form.Control
                        type="text"
                        name="img2"
                        value={currentProduct.img2}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                      <Form.Label>이미지 3</Form.Label>
                    </Col>
                    <Col md={10}>
                      <Form.Control
                        type="text"
                        name="img3"
                        value={currentProduct.img3}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                      <Form.Label>이미지 4</Form.Label>
                    </Col>
                    <Col md={10}>
                      <Form.Control
                        type="text"
                        name="img4"
                        value={currentProduct.img4}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                      <Form.Label>카테고리</Form.Label>
                    </Col>
                    <Col md={10}>
                      <Form.Control
                        type="text"
                        name="category"
                        value={currentProduct.category}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                      <Form.Label>원래 가격</Form.Label>
                    </Col>
                    <Col md={10}>
                      <Form.Control
                        type="number"
                        name="originalPrice"
                        value={currentProduct.originalPrice}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                      <Form.Label>할인율</Form.Label>
                    </Col>
                    <Col md={10}>
                      <Form.Control
                        type="number"
                        name="promotionPercent"
                        value={currentProduct.promotionPercent}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                      <Form.Label>원본 URL</Form.Label>
                    </Col>
                    <Col md={10}>
                      <Form.Control
                        type="text"
                        name="ORG_ITEM"
                        value={currentProduct.ORG_ITEM}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                      <Form.Label>AAH 상품 가격</Form.Label>
                    </Col>
                    <Col md={10}>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="GDS_AAH_PRICE"
                        value={currentProduct.GDS_AAH_PRICE}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                      <Form.Label>재고</Form.Label>
                    </Col>
                    <Col md={10}>
                      <Form.Control
                        type="number"
                        name="GDS_STOCK"
                        value={currentProduct.GDS_STOCK}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>닫기</Button>
                <Button variant="primary" onClick={handleSave}>변경사항 저장</Button>
              </Modal.Footer>
            </Modal>

            <Pagination
              count={totalPage}
              page={page}
              onChange={handleChangePage}
              color="primary"
              size="large"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
