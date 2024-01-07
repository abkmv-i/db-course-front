import {FC, useState} from 'react';
import '../App.css';

interface FormProps {
    title: string;
    handleClick: (email: string, pass: string) => void;
}

const Form: FC<FormProps> = ({title, handleClick}) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    return (
            <div>
                <h1>Login</h1>
                <input className="inp"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                />
                <input className="inp"
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="password"
                />
                <button className="add"
                        onClick={() => handleClick(email, pass)}
                >
                    {title}
                </button>
            </div>
    )
}

export {Form}
