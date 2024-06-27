// /shop.c4ei.net/frontend/src/page/Home.js
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getListProduct10 } from "../services/API/productApi";
import ProductBigSale from "../components/ProductBigSale";
import ProductForYou from "../components/ProductForYou";
import Subscr from "../components/Subscr";
import axios from 'axios';
import ChatGPTChat from '../components/ChatGPTChat'; // 추가된 라인

export default function Home() {
  const [bigSaleProducts, setBigSaleProducts] = useState([]);
  const listProduct = useSelector((state) => state.product.products.allProduct);
  const isFetching = useSelector((state) => state.product.products.isFetching);
  const error = useSelector((state) => state.product.products.error);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBigSaleProducts = async () => {
      try {
        const response = await axios.get('/api/bigsaleprod');
        setBigSaleProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching big sale products:', error);
      }
    };

    fetchBigSaleProducts();
    getListProduct10(dispatch);
  }, [dispatch]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products. Please try again later.</div>;
  }

  const limitedListProduct = Array.isArray(listProduct) ? listProduct.slice(0, 12) : [];

  // const productDiscount = Array.isArray(listProduct) ? listProduct.filter((product) => {
  //   return product.promotionPercent >= 5;
  // }) : [];

  
  const partnerImages = [
    "https://i.ibb.co/5vgnxxc/image.png",
    "https://i.ibb.co/xGTQwgz/image.png",
    "https://i.ibb.co/5LzVfNC/image.png",
    "https://i.ibb.co/jfXd9dm/image.png",
    "https://i.ibb.co/gW3F61X/image.png",
    "https://i.ibb.co/88J4QLT/image.png",
    "https://i.ibb.co/6ZtB5nb/image.png",
    "https://i.ibb.co/MnydK1p/image.png",
    "https://i.ibb.co/VTq67yC/image.png",
    "https://i.ibb.co/rd68yX3/image.png",
    "https://i.ibb.co/VHRgJQG/image.png",
    "https://i.ibb.co/WfxKjCW/image.png",
    "https://i.ibb.co/BZRZGdG/image.png",
    "https://i.ibb.co/dbgvhpw/image.png",
    "https://i.ibb.co/qYj2NVq/image.png",
    "https://i.ibb.co/3hX32zY/image.png",
    "https://i.ibb.co/Z11HQzM/image.png",
    "https://i.ibb.co/yXKKLYb/image.png",
    "https://i.ibb.co/XXMMdLC/image.png",
    "https://i.ibb.co/PgHZZS4/image.png",
    "https://i.ibb.co/27JK4By/image.png",
    "https://i.ibb.co/gZRm9sQ/image.png",
    "https://i.ibb.co/pb3kZJG/image.png",
    "https://i.ibb.co/FqFPSt3/image.png",
    "https://i.ibb.co/D7NYJRd/image.png",
    "https://i.ibb.co/qsVhdMj/image.png",
    "https://i.ibb.co/0jkrgcG/image.png",
    "https://i.ibb.co/ZTq2jyg/image.png",
    "https://i.ibb.co/VTQDmMt/image.png",
    "https://i.ibb.co/58zByNQ/image.png",
    "https://i.ibb.co/khtFSw8/image.png",
    "https://i.ibb.co/FsjBmHL/image.png",
    "https://i.ibb.co/g4vf1qH/image.png",
    "https://i.ibb.co/KVtkHfR/image.png",
    "https://i.ibb.co/xGHYKtf/image.png",
    "https://i.ibb.co/MVx392C/image.png",
    "https://i.ibb.co/NWXwBs9/2.png"
  ];

  return (
    <div className="page-holder">
      <div className="header bg-white">
        <div className="container">
          <div
            className="hero pb-3 bg-cover bg-center d-flex align-items-center"
            style={{
              backgroundImage: `url("/image/banner1.jpg")`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div className="container py-5">
              <div className="row px-4 px-lg-5">
                <div className="col-lg-6">
                  <p className="text-muted small text-uppercase mb-2">
                    New Inspiration 2024
                  </p>
                  <h1 className="h2 text-uppercase mb-3">
                    20% off on new season
                  </h1>
                  <a className="btn btn-dark" href="shop.html">
                    AAH로 구매하기
                  </a>
                  <br/><br/>
                  <a className="btn btn-dark" href="https://docs.google.com/document/d/1cVD4bqt3K9rIK2kO1SCSWljD0X0mJ-OceeK_F3DBnaU/edit?usp=sharing" target="_blank">
                    AAH몰설명서
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="py-5" id="section_product">
            <div>
              <p className="small text-muted small text-uppercase mb-1">
                Made the hard way
              </p>
              <h2 className="h5 text-uppercase mb-4">Product Spend For You</h2>
            </div>
            <div className="row d-block">
              <ProductForYou listProduct={limitedListProduct} />
            </div>
          </div>

          <div className="pt-5">
            <div className="text-center">
              <p className="small text-muted small text-uppercase mb-1">
                Carefully created collections
              </p>
              <h2 className="h5 text-uppercase mb-4">Browse our categories</h2>
            </div>
            <div className="row">
              <div className="col-md-4 mb-4 mb-md-0">
                <NavLink className="category-item" to="/Goods?category=75">
                  <img
                    className="img-fluid"
                    src="/image/cat-img-1.jpg"
                    alt=""
                  />
                  <strong className="category-item-title">Watches</strong>
                </NavLink>
              </div>
              <div className="col-md-4 mb-4 mb-md-0">
                <NavLink className="category-item mb-4" to="/Goods?category=68">
                  <img
                    className="img-fluid"
                    src="/image/cat-img-2.jpg"
                    alt=""
                  />
                  <strong className="category-item-title">건강</strong>
                </NavLink>
                <NavLink className="category-item" to="/Goods?category=72">
                  <img
                    className="img-fluid"
                    src="/image/cat-img-3.jpg"
                    alt=""
                  />
                  <strong className="category-item-title">화장품</strong>
                </NavLink>
              </div>
              <div className="col-md-4">
                <NavLink className="category-item" to="/Goods?category=69">
                  <img
                    className="img-fluid"
                    src="/image/cat-img-4.jpg"
                    alt=""
                  />
                  <strong className="category-item-title">가전</strong>
                </NavLink>
              </div>
            </div>
          </div>
          <div className="py-5" id="section_product">
            <div>
              <p className="small text-muted small text-uppercase mb-1">
                Made the hard way
              </p>
              <h2 className="h5 text-uppercase mb-4">Discount Products</h2>
            </div>
            <div className="row d-block">
              <ProductBigSale productDiscount={bigSaleProducts} />
            </div>
          </div>

          {/* ChatGPT Chat Section */}
          <div className="py-5" id="section_chatgpt">
            <div className="text-center">
              <p className="small text-muted small text-uppercase mb-1">
                Chat with GPT
              </p>
              <h2 className="h5 text-uppercase mb-4">AI Chat Assistant</h2>
            </div>
            <div className="row d-block">
              <ChatGPTChat />
            </div>
          </div>

          <div className="py-5" id="section_partners">
            <div className="text-center">
              <p className="small text-muted small text-uppercase mb-1">
                Trusted by top brands
              </p>
              <h2 className="h5 text-uppercase mb-4">Partners</h2>
            </div>
            <div className="d-flex flex-wrap justify-content-center">
              {partnerImages.map((src, index) => (
                <img key={index} src={src} alt={`partner-${index}`} style={{ height: "80px", padding: "5px" }} />
              ))}
            </div>
          </div>

          <div className="py-5" id="section_partners">
          <Subscr />
          </div>

        </div>
      </div>
    </div>
  );
}
