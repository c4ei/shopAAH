import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import Slider from "react-slick";

export default function ProductForYou({ listProduct }) {
  const settings = {
    className: "center",
    infinite: true,
    autoplay: true,
    slidesToShow: 4,
    speed: 500,
    autoplaySpeed: 3000,
    cssEase: "linear",

    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <Fragment>
      <Slider {...settings}>
        {listProduct?.map((item, index) => (
          <div className="shadow " key={index}>
            <div className="product text-center">
              <div className="position-relative mb-3">
                <div className="badge text-white badge-secondary"></div>
                <NavLink className="d-block" to={`/detail/${item.id}`}>
                  <img
                    className="img-fluid w-100"
                    style={{ height: "300px" }}
                    src={item.img1}
                    alt={item.img1}
                  />
                </NavLink>
                <div className="product-overlay">
                  <ul className="mb-0 list-inline">
                    <li className="list-inline-item">
                      <NavLink
                        className="btn btn-sm btn-dark"
                        to={`/detail/${item.id}`}
                      >
                        SHOW
                      </NavLink>
                    </li>
                    {/* <li className="list-inline-item mr-0">
                      <a
                        className="btn btn-sm btn-outline-dark"
                        href={`#product_${item.id}`}
                        data-toggle="modal"
                      >
                        <i className="fas fa-expand"></i>
                      </a>
                    </li> */}
                  </ul>
                </div>
              </div>
              <div className="px-3">
                <h6>
                  <a className="reset-anchor" href="detail.html">
                    <p className="d-block"> {item.good_name}</p>
                  </a>
                </h6>
                <p className="small text-muted">₩{item.price}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>


    </Fragment>
  );
}
