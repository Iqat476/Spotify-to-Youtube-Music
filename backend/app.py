from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
from ytmusicapi import YTMusic
from ytmusicapi.auth.oauth.credentials import OAuthCredentials
import os
import requests
import asyncio

load_dotenv()

app = Flask(__name__)
CORS(app)

limiter = Limiter(get_remote_address, app=app, default_limits=["10 per minute"], headers_enabled=True)

@app.route("/to-ytm/<playlist_id>", methods=["POST"])
def spotify(playlist_id):
    # Spotify API
    try:
        r = requests.post(
            "https://accounts.spotify.com/api/token",
            data={"grant_type": "client_credentials", "client_id": os.environ.get("SPOTIFY_CLIENT_ID"), "client_secret": os.environ.get("SPOTIFY_CLIENT_SECRET")},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        ).json()

        tracks = []

        tracks_data = getTracks(r, playlist_id, 50, 0)

        for t in tracks_data["items"]:
            track = t.get("track")
            if track == None:
                continue

            tracks.append(f'{track["name"]} {", ".join(artist["name"] for artist in track["artists"])}')

        while tracks_data["next"] != None:
            tracks_data = getTracks(r, url=tracks_data["next"])

            for t in tracks_data["items"]:
                track = t.get("track")
                if track == None:
                    continue
                tracks.append(f'{track["name"]} {", ".join(artist["name"] for artist in track["artists"])}')

        playlist_name = requests.get(
            f'https://api.spotify.com/v1/playlists/{playlist_id}',
            headers={"Authorization": f'{r["token_type"]} {r["access_token"]}'}
        ).json()["name"]
    
    except Exception as error:
        return jsonify({"playlist": "Invalid Link/Private Playlist", "error": str(error)}), 404
    
    try:
        session_data = request.get_json()
        if not session_data or not all(k in session_data for k in {"access_token", "refresh_token", "scope", "expires_at"}):
          return jsonify({"error": "Invalid/missing authorization data"}), 400
        
        ytmusic = YTMusic(auth={
            'access_token': session_data["access_token"],
            'refresh_token': session_data["refresh_token"],
            'scope': session_data["scope"],
            'expires_at': session_data["expires_at"],
            'token_type': "Bearer"
        }, oauth_credentials=OAuthCredentials(client_id=os.environ.get("YTMUSIC_CLIENT_ID"), client_secret=os.environ.get("YTMUSIC_CLIENT_SECRET")))
        
        try:
            loop = asyncio.get_running_loop()
            track_ids = loop.run_until_complete(gather_ids(ytmusic, tracks))
        except RuntimeError:
            track_ids = asyncio.run(gather_ids(ytmusic, tracks))

        
        track_ids = [tid for tid in track_ids if tid]

        yt_playlist_id = ytmusic.create_playlist(playlist_name, "Converted from Spotify \n(https://fuck-spotify.taqi.dev/)", video_ids=track_ids, privacy_status="PUBLIC")
        
    except Exception as error:
        return jsonify({"playlist": str(error)}), 404

    return jsonify({
        "playlist": yt_playlist_id,
    }), 200
    
    
async def search_song(ytmusic, query):
    track = await asyncio.to_thread(ytmusic.search, query, filter="videos", limit=1)
    return track[0]["videoId"] if track and len(track) > 0 else None

async def gather_ids(ytmusic, tracks, max_concurrent=10):
     # avoid rate limiting
    semaphore = asyncio.Semaphore(max_concurrent)

    async def limited_search(track):
        async with semaphore:
            await asyncio.sleep(0.3)
            return await search_song(ytmusic, track)

    return await asyncio.gather(*(limited_search(track) for track in tracks))

def getTracks(r, playlist_id="", limit=50, offset=0, url=None):
    if url:
        return requests.get(url,
            headers={"Authorization": f'{r["token_type"]} {r["access_token"]}'}
        ).json()

    return requests.get(
        f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks?offset={offset}&limit={limit}',
        headers={"Authorization": f'{r["token_type"]} {r["access_token"]}'}
    ).json()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))