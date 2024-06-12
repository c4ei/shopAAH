import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ManageShop() {
  const user = useSelector((state) => state.auth.login.currentUser);
  const [userInfo, setUserInfo] = useState({ id: "", email: "", phone: "", address: "", reward_points: 0 });

  useEffect(() => {
    if (user) {
      setUserInfo({
        id: user.id,
        email: user.email,
        phone: user.phone,
        address: user.address,
        reward_points: user.reward_points,
      });
    }
  }, [user]);

  // 클립보드에 복사하는 함수
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("링크가 클립보드에 복사되었습니다.친구에게 알려주세요.");
      })
      .catch((error) => {
        console.error("클립보드 복사 오류:", error);
        alert("링크를 클립보드에 복사하는 동안 오류가 발생했습니다.");
      });
  };

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
          <tr>
            <th>POINT</th>
            <td>{userInfo.reward_points}</td>
          </tr>
        </tbody>
      </table>

      <h2 className="my-4">친구 추천</h2>
      <p>친구의 구매금액의 1%를 point 로 적립해 드립니다.</p>
      <table className="table">
        <tbody>
          <tr>
            <td>
              <button onClick={() => copyToClipboard(`https://shop.c4ei.net/register?referer_id=${userInfo.id}`)}>
              친구추가 링크 복사하기
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
