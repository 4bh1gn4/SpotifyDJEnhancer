import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1 style={{ color: 'green' }}>Welcome to My Music App</h1>
            <Link to="/playlist">View Playlist</Link>
            <br />
            <Link to="/playlist-tracks">Playlist Tracks</Link>
            <br />
            <Link to="/listening-history">Listening History</Link>
            <br />
            <Link to="/hello-world">Hello World</Link> {/* Add this line */}
        </div>
    );
}

export default Home;
