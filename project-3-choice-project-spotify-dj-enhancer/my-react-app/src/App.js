/**
 * App.js
 * 
 * Main entry point for the React frontend of the Spotify DJ Enhancer application.
 * This file sets up client-side routing using React Router, mapping URL paths to React components.
 * 
 * Key Features:
 * - Uses React Router v6 for navigation between pages/components.
 * - Defines routes for Home, Playlist, PlaylistTracks, HelloWorld (test), and AuthCallback (OAuth2 redirect).
 * - Each route renders a specific component based on the URL path.
 * 
 * Components:
 * - Home: Landing page for the app.
 * - Playlist: Displays and manages user playlists.
 * - PlaylistTracks: Shows tracks filtered by valence/mood.
 * - HelloWorld: Simple test component to verify backend connectivity.
 * - AuthCallback: Handles Spotify OAuth2 callback and token exchange.
 */

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Playlist from './Playlist';
import HelloWorld from './HelloWorld'; // Import the HelloWorld component
import AuthCallback from './AuthCallback';
import PlaylistTracks from './PlaylistTracks';

function App() {
    // Log to console each time the App component renders (for debugging)
    console.log('[App] Rendering App component');
    return (
        <Router>
            <Routes>
                {/* Route for the landing page */}
                <Route path="/" element={<Home />} />
                {/* Route for playlist management */}
                <Route path="/playlist" element={<Playlist />} />   
                {/* Route for a simple backend test endpoint */}
                <Route path="/hello-world" element={<HelloWorld />} /> {/* Add this line */}    
                {/* Route for handling Spotify OAuth2 callback */}
                <Route path="/auth/callback" element={<AuthCallback onAuthenticated={(token) => console.log(token)} />} />         
                {/* Route for displaying playlist tracks filtered by valence */}
                <Route path="/playlist-tracks" element={<PlaylistTracks />} />            
            </Routes>
        </Router>
    );
}

export default App;
