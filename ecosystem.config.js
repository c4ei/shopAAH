// /shop.c4ei.net/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'shopGTP5000',
      script: '/home/dev/.local/bin/gunicorn',  // gunicorn의 절대 경로
      args: '-w 2 -b 0.0.0.0:5000 gpt2_api_server:app',
      interpreter: '/usr/bin/python3',  // python3 경로
      env: {
        PATH: process.env.PATH,  // 환경 변수 설정
      },
    },
  ],
};
