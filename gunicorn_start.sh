#!/bin/bash

# gunicorn 실행 경로 확인 및 설정
GUNICORN_PATH=$(which gunicorn)

# gunicorn 실행 명령어
$GUNICORN_PATH -w 4 -b 0.0.0.0:5000 gpt2_api_server:app
