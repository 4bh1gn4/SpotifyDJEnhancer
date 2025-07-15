/**
 * AuthCallback.js
 * 
 * Handles the Spotify OAuth2 callback after user authentication.
 * This component is rendered when Spotify redirects back to the app with an authorization code.
 * 
 * Key Features:
 * - Extracts the authorization code from the URL query parameters.
 * - Sends the code to the backend /exchange-code endpoint to obtain an access token.
 * - Stores the access token in localStorage for later API requests.
 * - Navigates the user to the playlist tracks page upon successful authentication.
 * - Displays authentication status and error messages to the user.
 * 
 * Usage:
 * - Used as a route target for /auth/callback in React Router.
 * - Should be rendered only as part of the OAuth2 flow.
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AuthCallback() {
    const location = useLocation();
    const navigate = useNavigate();

    // State to track authentication progress
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        console.log('AuthCallback component mounted');
        // Extract the "code" query parameter from the URL
        const code = new URLSearchParams(location.search).get('code');

        if (code) {
            // If code exists, exchange it for an access token via backend
            console.log('Initiating fetch call to /exchange-code endpoint');            

            fetch(`${process.env.REACT_APP_API_URL}/exchange-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            })
            .then(response => {
                console.log(`Response status from /exchange-code: ${response.status}`);
                if (!response.ok){
                    throw new Error(`Server responded with status: ${response.status}`);
                }                
                return response.json();
            })
            .then(data => {
                // Log the response data from backend
                console.log('Data received from /exchange-code:', data);

                if (data.access_token) {
                    // Store access token in localStorage for future API calls
                    console.log (`access token : ${data.access_token}`)
                    localStorage.setItem('access-token', data.access_token);
                    localStorage.setItem('token-acquired', true);
                    console.log (`access token stored into local storage`)
                    // Redirect user to playlist tracks page
                    navigate('/playlist-tracks');
                } else {
                    // If token exchange failed, show error
                    console.error(`Token exchange failed:`, data);
                    setIsAuthenticating(false);
                }
            })
            .catch(error => {
                // Handle network or server errors
                console.error(`Error in token exchange call:`, error);
                setIsAuthenticating(false);
            });
        } else {
            // No code in URL, cannot authenticate
            console.error(`auth code does not exist`)
            setIsAuthenticating(false);
        }
        // Cleanup log on unmount
        return () => {
            console.log('AuthCallback component will unmount');
        };
    }, [location.search, navigate]);

    // Show loading or error UI based on authentication state
    if (isAuthenticating) {
        return <h1>Authenticating...</h1>;
    } else {
        return (
            <div>
                <h1>User not logged in</h1>
                <a href='/login'>Go to login</a>
            </div>
        );
    }
}

export default AuthCallback;
