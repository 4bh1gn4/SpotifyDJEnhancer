import React, { useState, useEffect } from 'react';

function HelloWorld() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/sayHello') // Make sure the port matches your Flask server
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                setMessage(data.message);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
}

export default HelloWorld;
