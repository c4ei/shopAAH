// /shop.c4ei.net/frontend/src/components/ManageShop.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DaumPostcode from "react-daum-postcode";
import axios from "axios";

export default function ManageShop() {
  const user = useSelector((state) => state.auth.login.currentUser);
  const [userInfo, setUserInfo] = useState({ id: "", email: "", phone: "", address: "", address1: "", address2: "", postcode: "", reward_points: 0 });
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    // console.log("14 line /frontend/src/components/ManageShop.js : "+ JSON.stringify(user));
    if (user) {
      setUserInfo({
        id: user.id,
        email: user.email,
        phone: user.phone,
        address:  `${user.address1} ${user.address2} ${user.postcode}`,
        address1: user.address1,
        address2: user.address2,
        postcode: user.postcode,
        reward_points: user.reward_points,
      });
    }
  }, [user]);

  // 클립보드에 복사하는 함수
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("링크가 클립보드에 복사되었습니다. 친구에게 알려주세요.");
      })
      .catch((error) => {
        console.error("클립보드 복사 오류:", error);
        alert("링크를 클립보드에 복사하는 동안 오류가 발생했습니다.");
      });
  };

  // 주소 검색 완료 시 처리 함수
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    setUserInfo({ ...userInfo, address1: fullAddress, postcode: data.zonecode });
    setIsPostcodeOpen(false);
    setIsEditingAddress(true);
  };

  // address2 변경 핸들러
  const handleAddress2Change = (e) => {
    setUserInfo({ ...userInfo, address2: e.target.value });
  };

  // 정보 저장 함수
  const saveUserInfo = () => {
    axios.post('/saveUserInfo', userInfo)
      .then(response => {
        alert("정보가 성공적으로 저장되었습니다.");
        // 정보 저장 후 업데이트된 주소 반영
        setUserInfo({ ...userInfo, address: `${userInfo.address1} ${userInfo.address2} ${userInfo.postcode}` });
        setIsEditingAddress(false);
      })
      .catch(error => {
        console.error("정보 저장 오류:", error);
        alert("정보를 저장하는 동안 오류가 발생했습니다.");
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
            <td colSpan={2}>
              <button onClick={() => setIsPostcodeOpen(true)}>주소 검색</button>
              <br/>
              {isPostcodeOpen && (
                <div className="postcode-modal">
                  <DaumPostcode onComplete={handleComplete} />
                  <button onClick={() => setIsPostcodeOpen(false)}>닫기</button>
                </div>
              )}
            </td>
          </tr>
          <tr>
            <th>전체 주소</th>
            <td>{userInfo.address}</td>
          </tr>
          {isEditingAddress && (
            <>
              <tr>
                <th>주소</th>
                <td>{userInfo.address1}</td>
              </tr>
              <tr>
                <th>상세 주소</th>
                <td>
                  <input
                    type="text"
                    value={userInfo.address2}
                    onChange={handleAddress2Change}
                    placeholder="상세 주소를 입력하세요"
                  />
                </td>
              </tr>
              <tr>
                <th>우편번호</th>
                <td>
                  {userInfo.postcode}
                  &nbsp;<button onClick={saveUserInfo}>주소 저장</button>
                </td>
              </tr>
            </>
          )}
          <tr>
            <th>POINT</th>
            <td>{userInfo.reward_points}</td>
          </tr>
        </tbody>
      </table>

      <h2 className="my-4">친구 추천</h2>
      <p>친구의 구매금액의 1%를 point로 적립해 드립니다.</p>
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
