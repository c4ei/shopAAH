// /shop.c4ei.net/frontend/src/components/User/HistoryUser.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListHistoryUser, getHistoryDetail } from "../../services/API/historyApi";
import queryString from "query-string";

export default function HistoryUser() {
  const dispatch = useDispatch();
  const histories = useSelector((state) => state.history.listHistory.histories || []);
  const user = useSelector((state) => state.auth.login.currentUser);
  const historyDetail = useSelector((state) => state.history.historyDetail?.detail || []);
  
  console.log("historyDetail:", historyDetail); // 디버깅 로그 추가

  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      const params = { idUser: user.id };
      const query = "?" + queryString.stringify(params);
      getListHistoryUser(dispatch, query);
    }
  }, [dispatch, user]);

  const toggleExpand = (index, historyId) => {
    if (index === expandedIndex) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
      getHistoryDetail(dispatch, historyId);
    }
  };

  return (
    <div className="container">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">History</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active">History</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <div className="table-responsive pt-5 pb-5">
        <table className="table">
          <thead className="bg-light">
            <tr className="text-center">
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">ID Order</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">ID User</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Phone</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Address</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Cart</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Fullname</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Total</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Status</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Delivery</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Details</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {histories.map((history, index) => (
              <React.Fragment key={history.id}>
                <tr className="text-center">
                  <td className="border-0">{history.id}</td>
                  <td className="border-0">{history.idUser}</td>
                  <td className="border-0">{history.phone}</td>
                  <td className="border-0">{history.address}</td>
                  <td className="border-0">{history.cart}</td>
                  <td className="border-0">{history.fullname}</td>
                  <td className="border-0">{history.total}</td>
                  <td className="border-0">{history.status === 1 ? "Paid" : "Unpaid"}</td>
                  <td className="border-0">{history.delivery === 1 ? "Delivered" : "Not Delivered"}</td>
                  <td className="border-0">
                    <button onClick={() => toggleExpand(index, history.id)}>
                      {expandedIndex === index ? "Hide Details" : "View Details"}
                    </button>
                  </td>
                </tr>
                {expandedIndex === index && (
                  <tr>
                    <td colSpan="10">
                      <div>
                        <h5>Details for Order ID: {history.id}</h5>
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="border-0" scope="col">
                                <strong className="text-small text-uppercase">Product ID</strong>
                              </th>
                              <th className="border-0" scope="col">
                                <strong className="text-small text-uppercase">Product Name</strong>
                              </th>
                              <th className="border-0" scope="col">
                                <strong className="text-small text-uppercase">Purchase Price</strong>
                              </th>
                              <th className="border-0" scope="col">
                                <strong className="text-small text-uppercase">Quantity</strong>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {historyDetail.map((detail) => (
                              <tr key={detail.id} className="text-center">
                                <td className="border-0">{detail.productId}</td>
                                <td className="border-0">{detail.Product ? detail.Product.good_name : "N/A"}</td>
                                <td className="border-0">{detail.purchasePrice}</td>
                                <td className="border-0">{detail.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
