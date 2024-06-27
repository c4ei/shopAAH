# /home/dev/www/mall/shop.c4ei.net/gpt2_api_server.py
# pip install transformers torch
# cd /home/dev/www/mall/shop.c4ei.net
# pm2 start gunicorn --name shopGTP5000 -- -w 4 -b 0.0.0.0:5000 gpt2_api_server:app
from transformers import GPT2LMHeadModel, GPT2Tokenizer
from flask import Flask, request, jsonify
import sys
import re

# 표준 출력 인코딩 설정
sys.stdout.reconfigure(encoding='utf-8')

app = Flask(__name__)

# 모델 이름
model_name = '/home/dev/www/mall/shop.c4ei.net/ai/gpt2-finetuned'  # 미리 학습된 모델 경로를 설정하십시오.

# 모델 및 토크나이저 로드
try:
    print(f"모델 이름: {model_name}")
    tokenizer = GPT2Tokenizer.from_pretrained(model_name)
    model = GPT2LMHeadModel.from_pretrained(model_name)
    print("모델과 토크나이저가 성공적으로 로드되었습니다.")
except Exception as e:
    print(f"모델 로드 중 에러 발생: {e}")
    sys.exit(1)

# 패딩 토큰 설정
tokenizer.pad_token = tokenizer.eos_token
model.config.pad_token_id = tokenizer.pad_token_id

@app.route('/api/generate', methods=['POST'])
def generate_text():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        # 입력값 인코딩
        inputs = tokenizer(prompt, return_tensors='pt', padding=True, truncation=True, max_length=100)
        
        # 텍스트 생성
        outputs = model.generate(
            input_ids=inputs['input_ids'],
            attention_mask=inputs['attention_mask'],
            max_length=200,
            num_return_sequences=1,
            pad_token_id=tokenizer.eos_token_id,
            no_repeat_ngram_size=2,
            early_stopping=True,
            do_sample=True,
            temperature=0.7,
            top_k=50,
            top_p=0.9,
            num_beams=5
        )

        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

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
