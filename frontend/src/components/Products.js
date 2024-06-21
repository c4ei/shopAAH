// /shop.c4ei.net/frontend/src/components/Products.js
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Products({ productPanigation, sort }) {
  const [productSort, setProductSort] = useState([]);

  useEffect(() => {
    console.log("Props received in Products:", { productPanigation, sort });

    const sortedProducts = Array.isArray(productPanigation) ? [...productPanigation] : [];

    if (sort === "DownToUp") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "UpToDown") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    console.log("productSort after sorting:", sortedProducts);
    setProductSort(sortedProducts);
  }, [productPanigation, sort]);

  if (productSort.length === 0) return <div>No products available</div>;

  return (
    <div className="row">
      {productSort.map((item, index) => (
        <div className="col-lg-4 col-sm-6 Section_Category mb-5" key={index}>
          <div className="product text-center">
            <div className="position-relative mb-3">
              <NavLink className="d-block" to={`/detail/${item.id}`}>
                <img className="img-fluid w-100" src={item.img1} alt="..." />
              </NavLink>
              <div className="product-overlay">
                <ul className="mb-0 list-inline">
                  <li className="list-inline-item m-0 p-0">
                    <NavLink className="btn btn-sm btn-dark" to={`/detail/${item.id}`}>
                      SHOW
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
            <h6>
              <a className="reset-anchor">{item.good_name}</a>
            </h6>
            <p className="small text-muted">₩{item.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
