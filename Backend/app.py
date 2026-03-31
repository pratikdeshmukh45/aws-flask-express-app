from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

messages = []

@app.route('/')
def home():
    return "Backend is running"

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify(messages)

@app.route('/api/data', methods=['POST'])
def add_data():
    data = request.get_json()

    name = data.get("name")
    message = data.get("message")

    if not name or not message:
        return jsonify({"error": "Invalid input"}), 400

    messages.append({
        "name": name,
        "message": message
    })

    return jsonify({"status": "success", "data": messages})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)