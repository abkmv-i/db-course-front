//import {useId, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Form} from './Form';
import '../App.css';

interface User {
    userId: string;
}

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async (email: string, password: string) => {

        try {

            const response = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })

            });
            const user = await response.json();

            if (response.ok) {

                if (user.userId === 2 || user.userId === null) {

                    navigate('/home');
                }
                else if(user.userId === 1){
                    navigate('/homeAdmin');
                }
                console.log(user);
            } else {
                console.error('Invalid user!');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return <Form title="sign in" handleClick={handleLogin}/>;
};

export {Login};
