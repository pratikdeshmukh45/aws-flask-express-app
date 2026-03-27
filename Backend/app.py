from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Temporary storage (in-memory)
messages = []

# Health check
@app.route('/')
def home():
    return "Flask Backend Running 🚀"

# GET all messages
@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify(messages)

# POST new message
@app.route('/api/data', methods=['POST'])
def add_data():
    data = request.get_json()

    # Extract input
    name = data.get("name")
    message = data.get("message")

    # Store in list
    messages.append({
        "name": name,
        "message": message
    })

    return jsonify({"status": "success", "data": messages})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
