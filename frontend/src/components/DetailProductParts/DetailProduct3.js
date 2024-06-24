// /shop.c4ei.net/frontend/src/components/DetailProductParts/DetailProduct3.js
import React from "react";
import moment from "moment";

const DetailProduct3 = ({ comment, setComment, star, setStar, handleComment, listComment }) => {
  return (
    <div>
      <div className="form-group">
        <label htmlFor="exampleFormControlTextarea1">Comment:</label>
        <textarea id="exampleFormControlTextarea1" className="form-control" rows="3" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
      </div>
      <div className="d-flex justify-content-between">
        <div className="d-flex w-25">
          <span className="mt-2">Evaluate: </span>&nbsp; &nbsp;
          <input className="form-control w-25" type="number" min="1" max="5" value={star} onChange={(e) => setStar(e.target.value)} style={{ fontSize: '14px', minWidth: '60px', padding: '2px 6px' }} />
          &nbsp; &nbsp;
          <span className="mt-2">Star</span>
        </div>
        <div>
          <button className="btn btn-dark btn-sm btn-block px-0 text-white" style={{ width: "12rem" }} onClick={handleComment}>
            Send
          </button>
        </div>
      </div>
      <br />
      <ul className="nav nav-tabs border-0">
        <li className="nav-item">
          <a className="nav-link fix_comment" style={{ backgroundColor: "#383838", color: "#ffffff" }}>
            Reviews
          </a>
        </li>
      </ul>
      <div className="tab-content mb-5">
        <div className="tab-pane fade show active">
          <div className="p-4 p-lg-5 bg-white">
            <div className="col-lg-8">
              {listComment.map((value) => (
                <div className="media mb-3" key={value.id}>
                  <img className="rounded-circle" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="" width="50" />
                  <div className="media-body ml-3">
                    <h6 className="mb-0 text-uppercase">{value.fullname}</h6>
                    <p className="small text-muted mb-0 text-uppercase">{moment(value.createdAt).format("DD-MM-YYYY hh:mm:ss")}</p>
                    <ul className="list-inline mb-1 text-xs">
                      <li className="list-inline-item m-0">
                        <i className={value.star1}></i>
                      </li>
                      <li className="list-inline-item m-0">
                        <i className={value.star2}></i>
                      </li>
                      <li className="list-inline-item m-0">
                        <i className={value.star3}></i>
                      </li>
                      <li className="list-inline-item m-0">
                        <i className={value.star4}></i>
                      </li>
                      <li className="list-inline-item m-0">
                        <i className={value.star5}></i>
                      </li>
                    </ul>
                    <p className="text-small mb-0 text-muted">{value.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct3;
