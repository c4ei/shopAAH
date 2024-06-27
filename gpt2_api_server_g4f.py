# /home/dev/www/mall/shop.c4ei.net/gpt2_api_server.py
# pip install transformers torch
# cd /home/dev/www/mall/shop.c4ei.net
from flask import Flask, request, jsonify
import sys
import g4f
import re

# 표준 출력 인코딩 설정
sys.stdout.reconfigure(encoding='utf-8')

app = Flask(__name__)

@app.route('/api/generate', methods=['POST'])
def generate_text():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        # g4f를 사용한 요청 생성
        response = g4f.ChatCompletion.create(
            model="gpt-4",  # 또는 "gpt-3.5-turbo" 모델
            messages=[{"role": "user", "content": prompt}]
        )

        generated_text = response['choices'][0]['message']['content']

        # 텍스트에서 상품 링크를 HTML 링크로 변환하는 함수
        def replace_links_with_html(text):
            pattern = r'https://shop\.c4ei\.net/detail/\d+'
            return re.sub(pattern, lambda x: f'<a href="{x.group(0)}">상품바로가기</a>', text)

        generated_text_with_links = replace_links_with_html(generated_text)

        # 잘린 텍스트가 있으면 잘라내기
        if generated_text_with_links[-1] not in ['.', '!', '?']:
            generated_text_with_links = generated_text_with_links.rsplit(' ', 1)[0] + '...'

        # 디버깅을 위해 콘솔에 출력
        print(f"Prompt: {prompt}")
        print(f"Generated Text with Links: {generated_text_with_links}")

        # 첫 번째 문장만 선택하여 반환
        generated_text_first_sentence = generated_text_with_links.split('.')[0] + '.'

        return jsonify({'generatedText': generated_text_first_sentence})

    except Exception as e:
        print(f"텍스트 생성 중 에러 발생: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
