import React, { useState, useEffect } from 'react';
import { Range } from 'react-range';
import './PlaylistTracks.css';

function PlaylistTracks() {
    
    const [trackCount, setTrackCount] = useState(0);
    const [tracks, setTracks] = useState([]);
    const [selectedTracks, setSelectedTracks] = useState(new Set());
    const [playlistUrl, setPlaylistUrl] = useState(null); // Now we will use it to display the link.
    const [playlistName, setPlaylistName] = useState('');
    const [valenceRange, setValenceRange] = useState([0, 1]); // Default range

    const [valence, setValence] = useState(0.5);

    const [energy, setEnergy] = useState(0.5);
    const [danceability, setDanceability] = useState(0.5);
    const [acousticness, setAcousticness] = useState(0.5);

    useEffect(() => {        
        //console.log('PlaylistTracks component mounted'); // Log component mount
        fetchData();

        return () => {
            //console.log('PlaylistTracks component will unmount'); // Log component unmount
        };

    }, []);

    // Fetches all tracks without filtering
    const fetchAllTracks = () => {
        fetchData();
    };
    // Fetches tracks based on the current valence filter
    const fetchFilteredTracks = () => {
        fetchData(valenceRange[0], valenceRange[1]);;
    };

    const fetchData = (minValence, maxValence) => {
        console.log(valence);
        const accessToken = localStorage.getItem('access-token');

        if (!accessToken) {
            console.log('No access token, redirect to login');
            window.location.href = 'http://localhost:5000/login';
            return;
        }

        let url = 'http://localhost:5000/playlisttracks';
        if (minValence !== undefined && maxValence !== undefined) {
            url += `?min_valence=${minValence}&max_valence=${maxValence}`;
        }

        console.log(`Fetching tracks with URL: ${url}`);

        fetch(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        .then(response => {
            console.log(`Fetch response status: ${response.status}`);
            if (!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`); 
            }
            return response.json();
        })
        .then(data => {
            if (data.error){
                throw new Error (data.error)
            }
            console.log('Data received:', data);
            setTracks(data);

            setTrackCount(data.length);

        })
        .catch(error => console.error('Error fetching playlist tracks:', error));
    };

    const handleTrackSelect = (trackId) => {
        console.log('track id selected:', trackId)
        const newSelectedTracks = new Set(selectedTracks);
        if (newSelectedTracks.has(trackId)) {
            newSelectedTracks.delete(trackId);
        } else {
            newSelectedTracks.add(trackId);
            
            
        }
        setSelectedTracks(newSelectedTracks);
        console.log('handleTrackSelect - selected tracks:', selectedTracks)
        
    };

    const createPlaylist = () => {
        console.log('in create playlist')
        console.log('createPlaylist - selected tracks: ', selectedTracks)

        const trackUris = Array.from(selectedTracks).map(id => {
            console.log('id: ', id)
            const track = tracks.find(track => track.id === id);

            console.log('track: ', track)
            console.log('track uri', track.uri)
            return track ? track.uri : null; // Ensure the track exists and has a URI

        }).filter(uri => uri !== null); // Filter out any undefined URIs

        console.log(`track uris: ${trackUris}`); // Debug: Log the URIs being sent

        if (!trackUris.length) {
            console.log('No tracks selected');
            return;
        }

        const accessToken = localStorage.getItem('access-token');
        fetch('http://localhost:5000/create_playlist', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                track_uris: trackUris,
                name: playlistName || 'New Filtered Playlist' // Use the user-entered name or default
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.playlist_url) {
                setPlaylistUrl(data.playlist_url);
                window.open(data.playlist_url, "_blank");
            }
            else {
                console.error('Failed to create playlist:', data.error);
            }
        })
        .catch(error => console.error('Error creating playlist:', error));
    };

    const handleWorkoutClick = () => {
        console.log('Workout button clicked');
        fetchData(0.6);
    };

    const handleStudyClick = () => {
        console.log('Study button clicked');
        fetchData(0.4);
    };

    return (
        <div className="container">
            <h1 style={{ color: 'green' }}>Playlist Tracks</h1>
            <label>Valence:</ label>
            <Range
                step={0.01}
                min={0}
                max={1}
                values={valenceRange}
                onChange={values => setValenceRange(values)}
                onFinalChange={fetchData}
                renderTrack={({ props, children }) => (
                    <div {...props} className="slider-track">{children}</div>
                )}
                renderThumb={({ props }) => (
                    <div {...props} className="slider-thumb" />
                )}
            />
            
            <div>
                <button onClick={fetchFilteredTracks}>Fetch Tracks</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {tracks.map(track => (
                    <div key={track.id}>
                        <input type="checkbox" checked={selectedTracks.has(track.id)} onChange={() => handleTrackSelect(track.id)} />
                        <p>{track.name} by {track.artist} (Valence: {track.valence})</p>
                        <a href={track.url} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>
                    </div>
                ))}
            </div>
            <input type="text" placeholder="Enter playlist name..." value={playlistName} onChange={e => setPlaylistName(e.target.value)} />
            <button onClick={createPlaylist} style={{ marginTop: '20px' }}>Create Playlist</button>
            {playlistUrl && <a href={playlistUrl} target="_blank" style={{ display: 'block', marginTop: '20px', color: 'blue' }}>Access Playlist</a>}
        </div>
        
    );
}

export default PlaylistTracks;