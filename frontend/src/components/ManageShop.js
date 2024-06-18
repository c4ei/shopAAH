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
  const [isPhoneEditOpen, setIsPhoneEditOpen] = useState(false);
  const [newPhone, setNewPhone] = useState("");

  useEffect(() => {
    if (user) {
      setUserInfo({
        id: user.id,
        email: user.email,
        phone: user.phone,
        address: `${user.address1} ${user.address2} ${user.postcode}`,
        address1: user.address1,
        address2: user.address2,
        postcode: user.postcode,
        reward_points: user.reward_points,
      });
    }
  }, [user]);

  // useEffect(() => {
  //   if (user) {
  //     fetchUserInfo(user.id);
  //   }
  // }, [user]);

  // const fetchUserInfo = async (userId) => {
  //   try {
  //     // will make /api/v2/users/getUserInfo 
  //     const response = await axios.get(`/api/v2/users/getUserInfo/${userId}`);
  //     const userData = response.data;
  //     setUserInfo({
  //       id: userData.id,
  //       email: userData.email,
  //       phone: userData.phone,
  //       address: `${userData.address1} ${userData.address2} ${userData.postcode}`,
  //       address1: userData.address1,
  //       address2: userData.address2,
  //       postcode: userData.postcode,
  //       reward_points: userData.reward_points,
  //     });
  //   } catch (error) {
  //     console.error("사용자 정보를 가져오는 중 오류가 발생했습니다:", error);
  //     alert("사용자 정보를 가져오는 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.");
  //   }
  // };

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

  // 새 전화번호 저장 함수
  const saveNewPhone = () => {
    if (/^\d{11}$/.test(newPhone)) {
      const updatedUserInfo = { ...userInfo, phone: newPhone };
      axios.post('/saveUserInfo', updatedUserInfo)
        .then(response => {
          alert("전화번호가 성공적으로 저장되었습니다.");
          setUserInfo(updatedUserInfo);
          // setUserInfo({ ...userInfo, phone: newPhone });
          setIsPhoneEditOpen(false);
        })
        .catch(error => {
          console.error("전화번호 저장 오류:", error);
          alert("전화번호를 저장하는 동안 오류가 발생했습니다.");
        });
    } else {
      alert("전화번호는 숫자만 11자리여야 합니다.");
    }
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
            <td>
              {userInfo.phone} &nbsp;
              {userInfo.phone.startsWith("999") && (
                <>
                  <button onClick={() => setIsPhoneEditOpen(true)}>변경</button>
                  {isPhoneEditOpen && (
                    <div className="phone-edit-modal">
                      <input
                        type="text"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="전화번호를 입력하세요"
                        maxLength={11}
                      />&nbsp;
                      <button onClick={saveNewPhone}>저장</button>
                      <button onClick={() => setIsPhoneEditOpen(false)}>닫기</button>
                    </div>
                  )}
                </>
              )}
            </td>
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
                  &nbsp;<button onClick={saveUserInfo}>정보 저장</button>
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
