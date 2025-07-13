
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AuthCallback() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isAuthenticating, setIsAuthenticating] = useState(true);


    useEffect(() => {
        console.log('AuthCallback component mounted');
        const code = new URLSearchParams(location.search).get('code');

        if (code) {
            //console.log(`Auth code obtained: ${code}`);
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
                //print json response.
                console.log('Data received from /exchange-code:', data);
                //console.log(`Access token: ${data.access_token}`);
                //console.log('Access token: ', data.access_token);

                if (data.access_token) {
                    console.log (`access token : ${data.access_token}`)

                    localStorage.setItem('access-token', data.access_token);
                    localStorage.setItem('token-acquired', true);

                    console.log (`access token stored into local storage`)

                    navigate('/playlist-tracks');
                } else {
                    console.error(`Token exchange failed:`, data);
                    setIsAuthenticating(false);

                }
            })
            .catch(error => {
                console.error(`Error in token exchange call:`, error);

                setIsAuthenticating(false);
            });
        } else {
            console.error(`auth code does not exist`)
            setIsAuthenticating(false);

        }
        return () => {
            console.log('AuthCallback component will unmount');
        };
    }, [location.search, navigate]);

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
