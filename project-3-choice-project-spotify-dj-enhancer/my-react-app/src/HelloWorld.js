import React, { useState, useEffect } from 'react';

function HelloWorld() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/sayHello`)
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
