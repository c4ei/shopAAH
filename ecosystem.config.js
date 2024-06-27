// /shop.c4ei.net/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'shopGTP5000',
      script: '/home/dev/.local/bin/gunicorn',
      args: '-w 1 -b 0.0.0.0:5000 gpt2_api_server:app',  // 워커 수를 필요에 따라 조정하십시오.
      interpreter: '/usr/bin/python3',
      env: {
        PATH: process.env.PATH,
      },
    },
  ],
};
