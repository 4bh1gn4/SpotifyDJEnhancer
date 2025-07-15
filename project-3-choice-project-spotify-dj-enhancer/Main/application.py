"""
Spotify DJ Enhancer Flask Application

This Flask backend provides endpoints for authenticating with Spotify, retrieving user playlists,
filtering tracks by valence (mood), and creating new playlists with selected tracks.
It is designed to work with a React frontend hosted on AWS Amplify.

Key Features:
- Spotify OAuth2 authentication flow
- Fetching user playlists and tracks
- Filtering tracks by valence (happiness/mood)
- Creating new playlists and adding tracks
- CORS enabled for secure frontend-backend communication

"""
import requests
import urllib
from datetime import datetime
from flask_cors import CORS, cross_origin

from flask import Flask, redirect, request, jsonify, session
application = Flask(__name__)

#CORS configuration for when code was hosted locally
#CORS(app)  # Apply CORS globally to all routes
#CORS(application, resources={r"/playlists": {"origins": "*"}}) 
#CORS(application, resources={r"/login": {"origins": "*"}}) 
#CORS(application, resources={r"/exchange-code": {"origins": "*"}}) 
#CORS(application, resources={r"/playlistTracks": {"origins": "*"}}) 
#CORS(application, resources={r"/sayHello": {"origins": "*"}})
#CORS(application, resources={r"/create_playlist": {"origins": "*"}}) 

# Enable CORS for the specified frontend origin
CORS(application, origins=["https://main.dqn9mdx08gdpc.amplifyapp.com"])

application.secret_key = "A4F8071D3B9F1A12E1F9C8FA0987C9BC"
  
# Spotify API credentials 
CLIENT_ID = "ed679e2536ba42b788035db8e4e25930"
CLIENT_SECRET = "0e5c46e53c8047f282b37c07cbcad0c1"

#Previously locally hosted redirect URL
#REDIRECT_URL = "http://localhost:5000/callback"

# Spotify endpoints
REDIRECT_URL = "https://main.dqn9mdx08gdpc.amplifyapp.com/auth/callback"
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"
APIBASE_URL = "https://api.spotify.com/v1/"


#print(CLIENT_ID, CLIENT_SECRET)

@application.before_request
def before_request():
    """
    Logs every incoming HTTP request for debugging and monitoring.
    """
    #Log incoming requests for debugging.
    print(f"Request received: {request.method} {request.url}")
    #print(f"Headers: {request.headers}")
    #print(f"Body: {request.get_data(as_text=True)}")

@application.after_request
def after_request(response):
    """
    Logs the completion of each HTTP request, including the status code.
    """
    print(f"Request to {request.path} completed with status {response.status_code}")
    return response

@application.errorhandler(Exception)
def handle_exception(e):
    """
    Catch-all error handler to log exceptions and return a generic error response.
    """
    print(f"An error occurred: {str(e)}")
    return jsonify({'error': 'Internal Server Error'}), 500

@application.route('/')
def index():
    """
    Root endpoint. Provides a simple HTML link to start Spotify authentication.
    """
    return "Spotify app <a href='/login'>Log in with spotify</a>"

@application.route('/login')
def login():
    """
    Redirects the user to Spotify's OAuth2 authorization page.
    The user will be asked to log in and authorize the app.
    """
    scope = "user-read-private user-read-email playlist-modify-private playlist-modify-public"
    parameters = {
        'client_id': CLIENT_ID,
        'response_type': 'code',
        'scope': scope,
        'redirect_uri': REDIRECT_URL,
        'show_dialog': True
    }
    auth_url = f"{AUTH_URL}?{urllib.parse.urlencode(parameters)}"
    return redirect(auth_url)

@application.route('/playlists')
def get_playlists():
    """
    Fetches the authenticated user's playlists from Spotify.

    Request:
        - Requires 'Authorization: Bearer <access_token>' header.

    Response:
        - JSON list of playlists, or error message if authentication fails.
    """
    #access_token = session.get('access_token')
    #expires_in = session.get('expires_in', 0)

    # Try to get the Authorization header
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'Authorization header is missing'}), 401

    # Extract the access token from the Authorization header
    access_token = auth_header.split(' ')[1]
    if not access_token:
        return jsonify({'error': 'Access token is missing'}), 401
    
    '''
    if not access_token or datetime.now().timestamp() > expires_in:
        print("Access token is missing or expired")
        return jsonify({'error': 'Authentication required'}), 401
    '''

    print (f"access token rcvd by playlist : {access_token}")

    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(f"{APIBASE_URL}me/playlists", headers=headers)

    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch playlists'}), response.status_code
    

    #print (f"play list call response code : {response.status_code}")

    response_data = response.json()  # Get the JSON data from the response
    #print("Playlist response data:", response_data)    
    #print (f"play list response : {jsonify(response.json())}                                           ")


    #return jsonify(response.json())
    return jsonify(response_data)

@application.route('/playlisttracks')
def get_playlist_tracks():
    """
    Fetches tracks from all user playlists and filters them by valence (mood).

    Query Parameters:
        - min_valence (float, optional): Minimum valence value (default 0)
        - max_valence (float, optional): Maximum valence value (default 1)

    Request:
        - Requires 'Authorization: Bearer <access_token>' header.

    Response:
        - JSON list of tracks with valence within the specified range.
        - Each track includes id, name, artist, uri, url, and valence.
    """
    auth_header = request.headers.get('Authorization')
    valence_filter = request.args.get('valence', type=float)
    
    if not auth_header or 'Bearer ' not in auth_header:
        return jsonify({'error': 'Authorization header is missing'}), 401

    access_token = auth_header.split(' ')[1]
    headers = {'Authorization': f'Bearer {access_token}'}

    min_valence = request.args.get('min_valence', type=float, default=0)
    max_valence = request.args.get('max_valence', type=float, default=1)
    print(f"min valence: {min_valence}, max valence: {max_valence}")
       
    # Fetch user's playlists
    playlists_response = requests.get(f"{APIBASE_URL}me/playlists", headers=headers)
    if playlists_response.status_code != 200:
        return jsonify({'error': 'Failed to fetch playlists'}), playlists_response.status_code

    playlists = playlists_response.json()['items']
    all_tracks = []

    # Fetch tracks from each playlist
    for playlist in playlists:        
        playlist_id = playlist['id']

        #print(f"processing playlist : {playlist_id}")

        tracks_response = requests.get(f"{APIBASE_URL}playlists/{playlist_id}/tracks?limit=5", headers=headers)
        
        if tracks_response.status_code != 200:
            continue  # Skip if the tracks cannot be fetched
        
        tracks_data = tracks_response.json()['items']
        
        # Fetch audio features (including valence) for each track
        for track_data in tracks_data:
            track = track_data['track']

            #print (f"processing track :")

            audio_features_response = requests.get(f"{APIBASE_URL}audio-features/{track['id']}", headers=headers)
            
            if audio_features_response.status_code == 200:
                audio_features = audio_features_response.json()
                #valence = audio_features['valence']
                valence = float(audio_features['valence'])
            else:
                valence = 'N/A'  # Valence not available

            if min_valence <= valence <= max_valence:
                    all_tracks.append({
                        'id': track['id'],
                        'name': track['name'],
                        'artist': track['artists'][0]['name'] if track['artists'] else 'Unknown artist',
                        'uri': track['uri'],
                        'url': track['external_urls']['spotify'],
                        'valence': valence
                    })

    return jsonify(all_tracks)

@application.route('/create_playlist', methods=['POST'])
def create_playlist():
    """
    Creates a new playlist for the user and adds selected tracks.

    Request:
        - JSON body: {
            "track_uris": [list of Spotify track URIs],
            "name": "Playlist Name" (optional)
          }
        - Requires 'Authorization: Bearer <access_token>' header.

    Response:
        - JSON with the new playlist's Spotify URL, or error message.
    """
    print("executing create playlist")
    data = request.json
    track_uris = data.get('track_uris', [])
    playlist_name = data.get('name', 'New Filtered Playlist')

    print("Received track URIs:", track_uris)
    print("Playlist name:", playlist_name)

    if not track_uris:
        print("No track URIs provided")
        return jsonify({'error': 'No track URIs provided'}), 400
    
    auth_header = request.headers.get('Authorization')
    if not auth_header or 'Bearer ' not in auth_header:
        print("Authorization header is missing or invalid")
        return jsonify({'error': 'Authorization header is missing'}), 401

    access_token = auth_header.split(' ')[1]
    user_response = requests.get(f"{APIBASE_URL}me", headers={"Authorization": f"Bearer {access_token}"})
    if user_response.status_code != 200:
        print("Failed to fetch user data")
        return jsonify({'error': 'Failed to fetch user data'}), user_response.status_code

    user_id = user_response.json().get('id')

    playlist_response = requests.post(
        f"{APIBASE_URL}users/{user_id}/playlists",
        headers={"Authorization": f"Bearer {access_token}"},
        json={"name": playlist_name, "description": "Created via Spotify App", "public": False}
    )
    
    playlist_id = playlist_response.json().get('id')
    if not playlist_id:
        print("Failed to create playlist")
        return jsonify({'error': 'Could not create playlist'}), 400

    # Add tracks to the new playlist
    if playlist_id:
        print("Created playlist successfully")
        add_tracks_response = requests.post(
            f"{APIBASE_URL}playlists/{playlist_id}/tracks",
            headers={"Authorization": f"Bearer {access_token}"},
            json={'uris': track_uris}
        )

    if add_tracks_response.status_code != 201:
        print("Failed to add tracks to the playlist")
        return jsonify({'error': 'Failed to add tracks'}), add_tracks_response.status_code

    playlist_url = playlist_response.json()['external_urls']['spotify']
    print(f"New playlist created: {playlist_url}")  # Print the playlist URL to the console
    return jsonify({'playlist_url': playlist_url})

@application.route('/exchange-code', methods=['POST'])
def exchange_code():
    """
    Exchanges the Spotify authorization code for an access token.

    Request:
        - JSON body: { "code": "<authorization_code>" }

    Response:
        - JSON with access_token, refresh_token, and expires_in, or error message.
    """
    print("Starting exchange code process")
    data = request.json
    code = data.get('code')
    print(f"Authorization code received: {code}")

    if not code:
        print (f"no authorization code received")
        return jsonify({'error': 'Authorization code is missing'}), 400
    
    if code:
        #print (f"code sent from clent: {code}")
        req_body = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URL,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        }
        
        response = requests.post(TOKEN_URL, data=req_body)
        #print (f"raw response: {response.content}")
        token_info = response.json()
        print(f"token info rcvd from spotify : {token_info}")
                
        if 'access_token' in token_info:
            session['access_token'] = token_info['access_token']
            session['refresh_token'] = token_info.get('refresh_token')
            session['expires_in'] = datetime.now().timestamp() + token_info.get('expires_in', 3600)
            
            return jsonify(token_info)
        else:
            print("Error in token exchange:", token_info.get('error_description'))
            return jsonify({'error': 'Failed to exchange code for token', 'details': token_info}), 400

    
@application.route('/sayHello')
# This decorator allows CORS on this route, overriding the global CORS configuration
#@cross_origin()
def hello_world():
    """
    Simple test endpoint to verify the Flask server is running.
    Returns a JSON greeting.
    """
    return jsonify(message='Hello World from Flask server')

if __name__ == '__main__':
    # Run the Flask app on all interfaces, with debug mode enabled for development.
    application.run(host='0.0.0.0', debug=True)
