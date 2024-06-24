// /shop.c4ei.net/frontend/src/components/DetailProductParts/DetailProduct1.js
import React from "react";

const DetailProduct1 = ({ product }) => {
  return (
    <div className="product-container">
      <div className="product-image">
        <img className="w-100" src={product?.img1} alt={product?.good_name} style={{ width: '300px', height: '300px' }} />
      </div>
      <div className="product-details">
        <h1 itemProp="name">{product?.good_name}</h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ul className="list-inline mb-2" style={{ marginRight: '10px' }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <li className="list-inline-item m-0" key={index}>
                <i className={`fas fa-star ${index < product?.rating ? 'text-warning' : 'text-muted'}`}></i>
              </li>
            ))}
          </ul>
          <p className="text-muted lead" style={{ margin: 0 }}>
            <span itemProp="priceCurrency" content="KRW">₩</span>
            <span itemProp="price">{product?.price?.toLocaleString()}</span>
          </p>
        </div>
        <p className="text-small mb-4 text-center text-sm-left product-description" dangerouslySetInnerHTML={{ __html: product?.description }} />
      </div>
    </div>
  );
};

export default DetailProduct1;
