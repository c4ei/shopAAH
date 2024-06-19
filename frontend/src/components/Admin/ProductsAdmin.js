// /shop.c4ei.net/frontend/src/components/Admin/ProductsAdmin.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import queryString from "query-string";
import {
  createProduct,
  deleteProduct,
  getListProductFilter,
  getListProductPanigation,
} from "../../services/API/productApi";
import Pagination from "@mui/material/Pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

export default function ProductsAdmin() {
  const productPanigation = useSelector(
    (state) => state.product.productPanigation?.allProductPanigation
  );
  const productFilter = useSelector(
    (state) => state.product.productFilter?.allProductFilter
  );

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("default");
  const [totalPage, setTotalPage] = useState();
  const [pagination, setPagination] = useState({
    page: "1",
    size: "9",
    search: "",
    category: "all",
  });
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    (async () => {
      const params = {
        page: pagination.page,
        size: pagination.size,
        search: pagination.search,
        category: pagination.category,
      };

      const query = queryString.stringify(params);
      const newQuery = "?" + query;
      await getListProductPanigation(dispatch, newQuery);
    })();
  }, [pagination, page, sort, load]);

  useEffect(() => {
    (async () => {
      const params = {
        page: "",
        size: "",
        search: pagination.search,
        category: pagination.category,
      };

      const query = queryString.stringify(params);
      const newQuery = "?" + query;
      await getListProductFilter(dispatch, newQuery);
    })();
  }, [page, pagination, sort]);

  useEffect(() => {
    let totalProduct = productFilter?.length;
    totalProduct = Math.ceil(totalProduct / pagination.size);
    setTotalPage(totalProduct);
  }, [page, pagination, sort, productFilter]);

  const handleChangePage = (e, value) => {
    e.preventDefault();
    window.scrollTo(0, 0);

    setPage(value);

    setPagination({
      page: value,
      size: pagination.size,
      search: pagination.search,
      category: pagination.category,
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      img1: "",
      img2: "",
      img3: "",
      img4: "",
      category: "",
      originalPrice: "",
      promotionPercent: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("(*) Full name is not empty"),
      description: Yup.string().required("(*) Description is not empty"),
      price: Yup.string()
        .required("(*) Price is not empty")
        .matches(/^[0-9]+$/, "price is invalid"),
      img1: Yup.string().required("(*) Img1 is not empty"),
      img2: Yup.string().required("(*) Img2 name is not empty"),
      img3: Yup.string().required("(*) Img3 name is not empty"),
      img4: Yup.string().required("(*) Img4 name is not empty"),
      category: Yup.string().required("(*) category is not empty"),
      originalPrice: Yup.string()
        .required("(*) originalPrice is not empty")
        .matches(/^[0-9]+$/, "originalPrice is invalid"),
      promotionPercent: Yup.string()
        .required("(*) promotionPercent is not empty")
        .matches(/^[0-9]+$/, "promotionPercent is invalid"),
    }),
    onSubmit: async (value) => {
      await createProduct(dispatch, value);
      setLoad(!load);
    },
  });

  const handleDelete = async (id) => {
    await deleteProduct(dispatch, id);
  };

  // #########################
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  
  const handleUpdateClick = (item) => {
    setCurrentProduct(item);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleSave = () => {
    axios.post('/saveProduct', currentProduct)
      .then(response => {
        alert(response.data);
        setShowModal(false);
      })
      .catch(error => {
        alert('Error saving product information');
      });
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
                      Home
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
                <h4 className="card-title">Products</h4>
                <div className="d-flex">
                  <input
                    className="form-control w-25"
                    type="text"
                    placeholder="Enter Search!"
                  />
                  <div>
                    <button
                      type="button"
                      className="btn btn-success mx-2"
                      data-toggle="modal"
                      data-target=".bd-example-modal-lg"
                    >
                      Add Product
                    </button>

                    <div
                      className="modal fade bd-example-modal-lg"
                      tabIndex={-1}
                      role="dialog"
                      aria-labelledby="myLargeModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-lg">
                        <form onSubmit={formik.handleSubmit}>
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5
                                className="modal-title"
                                id="exampleModalLongTitle"
                              >
                                Add Product
                              </h5>
                              <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">×</span>
                              </button>
                            </div>

                            <div className="container-fluid">
                              <div className="row p-3">
                                <div className="col-6">
                                  <div className="form-group">
                                    <label htmlFor="name">name</label>
                                    <input
                                      type="text"
                                      name="name"
                                      className="form-control"
                                      id="name"
                                      placeholder="Enter name"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.name}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="description">
                                      description
                                    </label>
                                    <input
                                      name="description"
                                      type="text"
                                      className="form-control"
                                      id="description"
                                      placeholder="Enter description"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.description}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="price">price</label>
                                    <input
                                      name="price"
                                      type="text"
                                      className="form-control"
                                      id="price"
                                      placeholder="Enter price"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.price}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="img1">img1</label>
                                    <input
                                      name="img1"
                                      type="text"
                                      className="form-control"
                                      id="img1"
                                      placeholder="Enter img1"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.img1}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="img2">img2</label>
                                    <input
                                      name="img2"
                                      type="text"
                                      className="form-control"
                                      id="img2"
                                      placeholder="Enter img2"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.img2}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="form-group">
                                    <label htmlFor="img3">img3</label>
                                    <input
                                      name="img3"
                                      type="text"
                                      className="form-control"
                                      id="img3"
                                      placeholder="Enter img3"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.img3}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="img4">img4</label>
                                    <input
                                      name="img4"
                                      type="text"
                                      className="form-control"
                                      id="img4"
                                      placeholder="Enter img4"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.img4}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="category">category</label>
                                    <input
                                      name="category"
                                      type="text"
                                      className="form-control"
                                      id="category"
                                      placeholder="Enter category"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.category}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="originalPrice">
                                      originalPrice
                                    </label>
                                    <input
                                      name="originalPrice"
                                      type="text"
                                      className="form-control"
                                      id="originalPrice"
                                      placeholder="Enter originalPrice"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.originalPrice}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="promotionPercent">
                                      promotionPercent
                                    </label>
                                    <input
                                      name="promotionPercent"
                                      type="text"
                                      className="form-control"
                                      id="promotionPercent"
                                      placeholder="Enter promotionPercent"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.promotionPercent}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal"
                              >
                                Close
                              </button>
                              <button type="submit" className="btn btn-success">
                                Save changes
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <br />

                <div className="table-responsive">
                  <table className="table table-striped table-bordered no-wrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Category</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productPanigation?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.good_name}</td>
                            <td>{item.price}</td>
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
                                type="submit"
                                className="btn btn-success mx-2"
                                style={{ cursor: "pointer", color: "white" }}
                                onClick={() => handleUpdateClick(item)}
                              >
                                Update
                              </button>
                              &nbsp;
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
                        );
                      })}
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
    </div>
  );
}
