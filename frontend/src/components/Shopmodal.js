// Shopmodal.js

import React from "react";

const Shopmodal = ({ products }) => {
  return (
    <>
      {products.map((item, index) => (
        <div className="modal fade show" id={`product_${item.id}`} key={index}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body p-0">
                <div className="row align-items-stretch">
                  <div className="col-lg-6 p-lg-0">
                    <img
                      style={{ width: "100%" }}
                      className="product-view d-block h-100 bg-cover bg-center"
                      src={item.img1}
                      data-lightbox={`product_${item.id}`}
                      alt={item.good_name}
                    />
                    {/* Assuming img2 and img3 are used in some way */}
                    <img className="d-none" href={item.img2} alt={item.good_name} />
                    <img className="d-none" href={item.img3} alt={item.good_name} />
                  </div>
                  <div className="col-lg-6">
                    <a
                      className="close p-4"
                      type="button"
                      href="#section_product"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      ×
                    </a>
                    <div className="p-5 my-md-4">
                      <ul className="list-inline mb-2">
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                      </ul>
                      <h2 className="h4">{item.good_name}</h2>
                      <p className="text-muted font-weight-bold">₩{item.price}</p>
                      <div className="row align-items-stretch mb-4">
                        <div className="col-sm-5 pl-sm-0 fix_addwish">
                          <a className="btn btn-dark btn-sm btn-block h-100 d-flex align-items-center justify-content-center px-0">
                            <i className="far fa-heart mr-2"></i>Add To Wish List
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Shopmodal;