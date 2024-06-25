# pip install transformers torch
# cd /home/dev/www/mall/shop.c4ei.net
# pm2 start gunicorn --name shopGTP5000 -- -w 4 -b 0.0.0.0:5000 gpt2_api_server:app

from transformers import GPT2LMHeadModel, GPT2Tokenizer
from flask import Flask, request, jsonify

app = Flask(__name__)

# 모델 및 토크나이저 로드
model_name = 'gpt2'
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

@app.route('/api/generate', methods=['POST'])
def generate_text():
    data = request.get_json()
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    inputs = tokenizer.encode(prompt, return_tensors='pt')
    outputs = model.generate(inputs, max_length=100, num_return_sequences=1)

    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return jsonify({'generatedText': generated_text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)