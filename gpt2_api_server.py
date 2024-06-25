# /home/dev/www/mall/shop.c4ei.net/gpt2_api_server.py
# pip install transformers torch
# cd /home/dev/www/mall/shop.c4ei.net
# pm2 start gunicorn --name shopGTP5000 -- -w 4 -b 0.0.0.0:5000 gpt2_api_server:app
from transformers import GPT2LMHeadModel, GPT2Tokenizer
from flask import Flask, request, jsonify
import sys

# 표준 출력 인코딩 설정
sys.stdout.reconfigure(encoding='utf-8')

app = Flask(__name__)

# 모델 및 토크나이저 로드
model_name = 'gpt2'
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

# 패딩 토큰 설정
tokenizer.pad_token = tokenizer.eos_token

@app.route('/api/generate', methods=['POST'])
def generate_text():
    data = request.get_json()
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    # 입력값 인코딩
    inputs = tokenizer(prompt, return_tensors='pt', padding=True, truncation=True)

    # 텍스트 생성
    outputs = model.generate(
        input_ids=inputs['input_ids'],
        attention_mask=inputs['attention_mask'],
        max_length=100,
        num_return_sequences=1,
        pad_token_id=tokenizer.eos_token_id,
        no_repeat_ngram_size=2,
        early_stopping=True,
        temperature=0.7,
        top_k=50,
        top_p=0.9
    )

    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # 디버깅을 위해 콘솔에 출력
    print(f"Prompt: {prompt}")
    print(f"Generated Text: {generated_text}")

    return jsonify({'generatedText': generated_text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)