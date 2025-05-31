import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Playlist from './Playlist';
import HelloWorld from './HelloWorld'; // Import the HelloWorld component
import AuthCallback from './AuthCallback';
import PlaylistTracks from './PlaylistTracks';

function App() {
    console.log('[App] Rendering App component');
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/playlist" element={<Playlist />} />   
                <Route path="/hello-world" element={<HelloWorld />} /> {/* Add this line */}    
                <Route path="/auth/callback" element={<AuthCallback onAuthenticated={(token) => console.log(token)} />} />         
                <Route path="/playlist-tracks" element={<PlaylistTracks />} />            
            </Routes>
        </Router>
    );
}

export default App;
