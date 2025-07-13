import React, { useState, useEffect } from 'react';

function Playlist() {
    const [playlists, setPlaylists] = useState([]);

    // Fetch playlists from your Flask API
    useEffect(() => {
        const accessToken = localStorage.getItem('access-token');
        const tokenAcquired = localStorage.getItem('token-acquired');

        console.log (`access token retrieved from local storage :  ${accessToken}`)

        if (!accessToken || tokenAcquired !== 'true') {
            console.log(`Access token is not found, redirect to login.`);
            // Construct Spotify authorization URL and redirect
            /*

            const clientId = 'ed679e2536ba42b788035db8e4e25930'; // Use your actual client ID
            const redirectUri = encodeURIComponent('http://localhost:3000/auth/callback');
            const scope = encodeURIComponent('user-read-private user-read-email');
            const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
            window.location.href = authUrl;
            */
            window.location.href = `${process.env.REACT_APP_API_URL}/login`;
            return;            
        }

        console.log (`proceeding to make a call to playlist call on the server`)
        
        fetch(`${process.env.REACT_APP_API_URL}/playlists`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        .then(response=> {
            console.log (`response code : ${response.status}`)
            if (response.ok) //200
            {                
                return response.json();
            }
            /*
            else {
                // Handle errors, for example, redirect to login if unauthorized
                if (response.status === 401) {
                    window.location.href = 'http://localhost:5000/login'; // Redirect to home for re-authentication
                }
                return Promise.reject('Failed to fetch playlists');
            } 
            */           
        })
        .then(data => {
            // Check if data is an array before setting the state
            console.log ('data: ', data)
            if (data && Array.isArray(data.items)) {
                setPlaylists(data.items);
            } else {
                console.error('Received data is not an array:', data);
                setPlaylists([]); // Set to empty array or handle as needed
            }
        })
        .catch(error => console.error('Error fetching playlist data: ', error));
    }, []);


    const handleStudyClick = () => {
        console.log('Study button clicked');
        // Additional logic for "Study" button click
    };

    const handleWorkOutClick = () => {
        console.log('Work Out button clicked');
        // Additional logic for "Work Out" button click
    };

   

    return (
        <div>
            <h1>My Spotify Playlists</h1>
            
            <button onClick={handleStudyClick}>Study</button>
            <button onClick={handleWorkOutClick}>Work Out</button>
            <ul>
                {playlists.map(playlist => (
                    <li key={playlist.id}>{playlist.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Playlist;
