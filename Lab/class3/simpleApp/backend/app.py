from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv

app = Flask(__name__)

# Enable CORS
CORS(app)

# Load environment vars
load_dotenv()

# DB configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define the model

class Disco(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    artist = db.Column(db.String(100))
    yearR = db.Column(db.Integer)
    genre = db.Column(db.String(100))

    def ___init__(self, title, artist, yearR, genre):
        self.title = title
        self.artist = artist
        self.yearR = yearR
        self.genre = genre

        # return f'{self.nombre} - {self.artista} - {self.lanzamiento}'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'artist': self.artist,
            'yearR': self.yearR,
            'genre': self.genre,
        }


@app.route('/')
def index():
    return 'Hello World'

@app.route('/discos', methods=['GET'])
def get_discos():
    try:
        discos = Disco.query.all()
        return jsonify([disco.to_dict() for disco in discos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/registro', methods=['POST'])
def registro():
    data = request.get_json()
    try:
        new_disco = Disco(title=data['title'], artist=data['artist'], yearR=data['yearR'], genre=data['genre'])
        db.session.add(new_disco)
        db.session.commit()
        return jsonify({'message': 'Disco registered'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(debug=True, host='0.0.0.0', port=8000)