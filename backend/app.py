from flask import Flask, render_template, jsonify
from flask_cors import CORS
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)


load_dotenv()

cid = os.getenv('SPOTIPY_CLIENT_ID')
secret = os.getenv('SPOTIPY_CLIENT_SECRET')

scope = "user-library-read user-read-recently-played"

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope, 
                                               client_id = cid, 
                                               client_secret = secret, 
                                               redirect_uri = "http://localhost:8000/callback"))

@app.route('/')
def index():
    recents = [track['track'] for track in sp.current_user_recently_played(limit=5)['items']]
    return render_template('index.html', recents=recents)

@app.route('/api/recents')
def api_recents():
    recents = [track['track'] for track in sp.current_user_recently_played(limit=5)['items']]
    return jsonify(recents)

@app.route('/api/recommendations/<string:track_id>')
def api_recommendations(track_id):
    track_features = sp.audio_features(track_id)[0]
    recommendations = [rec for rec in sp.recommendations(limit = 5,
                                     seed_tracks = [track_id], 
                                         seed_genres = ["k-pop", "j-pop"],
                                         max_popularity = 60, 
                                        target_tempo = track_features['tempo'],
                                        target_time_signature = track_features['time_signature'])['tracks']]
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)