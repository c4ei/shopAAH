// Category.js

import React from "react";

const Category = ({ handleCategory }) => {
  return (
    <div className="col-lg-3 order-2 order-lg-1">
      <h5 className="text-uppercase mb-4">Categories</h5>
      <ul className="list-unstyled small text-muted pl-lg-4 font-weight-normal">
        <li className="mb-2">
          <a className="reset-anchor" href="#" onClick={() => handleCategory("all")}>
            All
          </a>
        </li>
        <li className="mb-2">
          <a className="reset-anchor" href="#" onClick={() => handleCategory("68")}>
            건강
          </a>
        </li>
        <li className="mb-2">
          <a className="reset-anchor" href="#" onClick={() => handleCategory("72")}>
            화장품
          </a>
        </li>
        <li className="mb-2">
          <a className="reset-anchor" href="#" onClick={() => handleCategory("75")}>
            Watches & ACC
          </a>
        </li>
        <li className="mb-2">
          <a className="reset-anchor" href="#" onClick={() => handleCategory("69")}>
            가전
          </a>
        </li>
        <li className="mb-2">
          <a className="reset-anchor" href="#" onClick={() => handleCategory("71")}>
            생활
          </a>
        </li>
        <li className="mb-2">
          <a className="reset-anchor" href="#" onClick={() => handleCategory("70")}>
            주방
          </a>
        </li>
        <li className="mb-2">
          <a className="reset-anchor" href="#" onClick={() => handleCategory("73")}>
            캐리어.잡화
          </a>
        </li>
        <li className="mb-2">
          <a className="reset-anchor" href="#" onClick={() => handleCategory("74")}>
            캠핑
          </a>
        </li>
        <li className="mb-2">
          <a className="reset-anchor" href="#" onClick={() => handleCategory("76")}>
            건강번들
          </a>
        </li>
        <li className="mb-2">
          <a className="reset-anchor" href="#" onClick={() => handleCategory("81")}>
            먹거리
          </a>
        </li>
        <li className="mb-2">
          <a className="reset-anchor" href="#" onClick={() => handleCategory("80")}>
            전자담배
          </a>
        </li>
        <li className="mb-2">
          <a className="reset-anchor" href="#" onClick={() => handleCategory("78")}>
            계절가전
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Category;
