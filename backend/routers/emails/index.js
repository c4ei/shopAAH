// /shop.c4ei.net/backend/routers/emails/index.js
const express = require("express");
const { authenticate } = require("../../middwares/auth");
const { sendMail } = require("../../mailer");
const nodeMailer = require("nodemailer");
const { gethistory, getHistoryDetail } = require("../../services/history");

const emailRouter = express.Router();

emailRouter.post("/", [authenticate], async (req, res) => {
  const { fullName, email, phone, address } = req.body;
  const user = req.user;

  const subject = "AAH MALL";

  // Get the user's history (assuming the most recent history is required)
  const userHistory = await gethistory(user.id);
  // console.log("User History:", userHistory);
  
  // Check if gethistory returns data in descending order
  const recentHistory = userHistory.length > 0 ? userHistory[0] : null;

  if (!recentHistory) {
    return res.status(400).send({ message: "No history found for the user." });
  }

  // Get the details of the most recent history
  const historyDetails = await getHistoryDetail(recentHistory.id);
  // console.log("History Details:", historyDetails);

  const total = historyDetails.reduce((total, item) => {
    return total + parseInt(item.purchasePrice) * parseInt(item.quantity);
  }, 0);

  const htmlHead = `<table style="width:50%">
    <tr style="border: 1px solid black;">
      <th style="border: 1px solid black;">제품명</th>
      <th style="border: 1px solid black;">가격</th>
      <th style="border: 1px solid black;">수량</th>
      <th style="border: 1px solid black;">구매금액</th>
    </tr>`;

  let htmlContent = "";

  for (const detail of historyDetails) {
    const productName = detail.Product ? detail.Product.good_name : "Unknown Product";
    const price = detail.purchasePrice;
    const count = detail.quantity;
    const totalPrice = parseInt(price) * parseInt(count);

    htmlContent += `<tr>
      <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">
        ${productName}
      </td>
      <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">
        ${price}₩
      </td>
      <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">
        ${count}
      </td>
      <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">
        ${totalPrice}₩
      </td>
    </tr>`;
  }

  const htmlResult = `
    <h1>안녕하세요 ${fullName}님</h1>
    <h3>Phone: ${phone}</h3>
    <h3>Address: ${address}</h3>
    <h3>입금하실 계좌정보 : 카카오뱅크 3333-27-5746222 예금주:씨포이아이(C4EI)</h3>
    <h3>총 결제금액: ${total} ₩</h3>
    ${htmlHead}
    ${htmlContent}
    </table>
    <p>감사합니다!</p>
  `;

  const info = await sendMail(email, subject, htmlResult);

  res.status(200).send({ sendEmail: nodeMailer.getTestMessageUrl(info) });
});

module.exports = emailRouter;
