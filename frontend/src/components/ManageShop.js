import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ManageShop() {
  const user = useSelector((state) => state.auth.login.currentUser);
  const [userInfo, setUserInfo] = useState({ email: "", phone: "", address: "" });

  useEffect(() => {
    if (user) {
      setUserInfo({
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
    }
  }, [user]);

  return (
    <div className="container">
      <h2 className="my-4">내 정보</h2>
      <table className="table">
        <tbody>
          <tr>
            <th>Email</th>
            <td>{userInfo.email}</td>
          </tr>
          <tr>
            <th>전화번호</th>
            <td>{userInfo.phone}</td>
          </tr>
          <tr>
            <th>주소</th>
            <td>{userInfo.address}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
