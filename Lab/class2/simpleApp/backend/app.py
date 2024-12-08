from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS
CORS(app)

# Database will be an array
users = []

@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(users)

@app.route('/users', methods=['POST'])
def add_users():
    data = request.get_json()
    if 'name' and 'emai' in data:
        users.append(data)
        return jsonify({'message': 'user added'}), 200
    return jsonify({'message': 'user not added'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)