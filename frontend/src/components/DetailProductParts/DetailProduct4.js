// /shop.c4ei.net/frontend/src/components/DetailProductParts/DetailProduct4.js
import React from "react";
import ProductForYou from "../ProductForYou";

const DetailProduct4 = ({ limitedListProduct }) => {
  return (
    <div>
      <h2 className="h5 text-uppercase mb-4">Related products</h2>
      <div className="row d-block">
        <ProductForYou listProduct={limitedListProduct} />
      </div>
    </div>
  );
};

export default DetailProduct4;
