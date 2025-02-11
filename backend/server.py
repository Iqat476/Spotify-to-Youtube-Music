from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from ytmusicapi import YTMusic
from ytmusicapi.auth.oauth.credentials import OAuthCredentials
import os
import requests

load_dotenv()

app = Flask(__name__)
CORS(app)
@app.route("/to-ytm/<playlist_id>", methods=["POST"])
def spotify(playlist_id):
    # Spotify API
    try:
        r = requests.post(
            "https://accounts.spotify.com/api/token",
            data={"grant_type": "client_credentials", "client_id": os.environ.get("SPOTIFY_CLIENT_ID"), "client_secret": os.environ.get("SPOTIFY_CLIENT_SECRET")},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        ).json()

        tracks = [[""] for x in range(2)]

        del tracks[0][0]
        del tracks[1][0]

        tracks_data = getTracks(r, playlist_id, 50, 0)

        for t in tracks_data["items"]:
            track = t["track"]
            tracks[0].append(track["name"])
            tracks[1].append(track["artists"])

        while tracks_data["next"] != None:
            tracks_data = getTracks(r, url=tracks_data["next"])

            for t in tracks_data["items"]:
                track = t["track"]
                tracks[0].append(track["name"])
                tracks[1].append(track["artists"])

        playlist_name = requests.get(
            f'https://api.spotify.com/v1/playlists/{playlist_id}',
            headers={"Authorization": f'{r["token_type"]} {r["access_token"]}'}
        ).json()["name"]
    
    except Exception as error:
        return jsonify({"playlist": "Invalid Link", "error": str(error)}), 404
    
    try:
        session_data = request.get_json()
        ytmusic = YTMusic(auth={
            'access_token': session_data["access_token"],
            'refresh_token': session_data["refresh_token"],
            'scope': session_data["scope"],
            'expires_at': session_data["expires_at"],
            'token_type': "Bearer"
        }, oauth_credentials=OAuthCredentials(client_id=os.environ.get("YTMUSIC_CLIENT_ID"), client_secret=os.environ.get("YTMUSIC_CLIENT_SECRET")))

        track_ids = []
        for i in range(len(tracks[0])):
            artists = ""
            for artist in tracks[1][i]:
                if artist["name"] != None:
                    artists += artist["name"] + " "
            track_ids.append(ytmusic.search(f'{tracks[0][i]} {artists}', filter="videos", limit=1)[0]["videoId"])

        yt_playlist_id = ytmusic.create_playlist(playlist_name, "Converted from Spotify \n(https://fuck-spotify.taqi.dev/)", video_ids=track_ids, privacy_status="PUBLIC")
        
    except Exception as error:
        return jsonify({"playlist": str(error)}), 404

    return jsonify({
        "playlist": yt_playlist_id,
    }), 200
    

def getTracks(r, playlist_id="", limit=50, offset=0, url=None):
    if url != None:
        return requests.get(url,
            headers={"Authorization": f'{r["token_type"]} {r["access_token"]}'}
        ).json()

    return requests.get(
        f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks?offset={offset}&limit={limit}',
        headers={"Authorization": f'{r["token_type"]} {r["access_token"]}'}
    ).json()

if __name__ == "__main__":
    app.run()