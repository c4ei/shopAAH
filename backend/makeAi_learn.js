const fs = require('fs');
const mysql = require('mysql2/promise');
const dotenv = require("dotenv");
dotenv.config();

// 데이터베이스 연결 설정
const pool = mysql.createPool({
    connectionLimit: 2,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
  
// 학습 자료 파일 생성 함수
async function createLearningData() {
  const query = 'SELECT id, good_name, price, description FROM Products';
  
  try {
    const [rows] = await pool.query(query);
    
    let learningData = '';

    rows.forEach(row => {
      const { id, good_name, price, description } = row;
      const link = `https://shop.c4ei.net/detail/${id}`;
      learningData += `상품명: ${good_name}\n가격: ${price}원\n 링크: ${link}\n\n`;
    });

    fs.writeFileSync('/home/dev/www/mall/shop.c4ei.net/ai/train_data.txt', learningData, 'utf8');
    console.log('학습 자료 파일이 성공적으로 생성되었습니다.');
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
  }
}

createLearningData();
