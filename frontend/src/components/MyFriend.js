import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function MyFriend() {
  const user = useSelector((state) => state.auth.login.currentUser);
  const [friends, setFriends] = useState([]);
  const [rewards, setRewards] = useState({ reward_points: 0, total_rewards: 0 });

  useEffect(() => {
    if (user) {
      // 친구 목록 가져오기
      axios.get(`/api/friends/${user.id}`)
        .then(response => {
          setFriends(response.data);
        })
        .catch(error => {
          console.error("친구 목록을 가져오는 동안 오류가 발생했습니다.", error);
        });

      // 포인트 및 적립금액 가져오기
      axios.get(`/api/rewards/${user.id}`)
        .then(response => {
          setRewards(response.data);
        })
        .catch(error => {
          console.error("적립금액을 가져오는 동안 오류가 발생했습니다.", error);
        });
    }
  }, [user]);

  return (
    <div className="container">
      <h2 className="my-4">내 친구</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {friends.map((friend) => (
            <tr key={friend.id}>
              <td>{friend.id}</td>
              <td>{friend.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="my-4">내 포인트 및 적립금</h2>
      <table className="table">
        <tbody>
          <tr>
            <th>내 포인트</th>
            <td>{rewards.reward_points}</td>
          </tr>
          <tr>
            <th>친구 구매 적립금</th>
            <td>{rewards.total_rewards}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
