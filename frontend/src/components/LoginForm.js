import React, { useState } from 'react';
import '../styles/global.css';

const LoginForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!username) {
            newErrors.username = 'Username is required';
        } else if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Stubbed submit logic - in future, this would make API call
            console.log('Login submitted:', { username, password });
            // Close the form or handle success
            setIsOpen(false);
        }
    };

    return (
        <div className="login">
            <button onClick={() => setIsOpen(true)}>Login</button>

            <div className={`${isOpen ? 'show' : 'close'}`}>
                <div className="imgcontainer">
                    <span className="material-symbols-outlined">account_circle</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="container">
                        <label><b>Username</b></label>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            name="uname"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={3}
                        />
                        {errors.username && <p className="error">{errors.username}</p>}

                        <label><b>Password</b></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="psw"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        {errors.password && <p className="error">{errors.password}</p>}

                        <label>
                            <input type="checkbox" name="remember" /> Remember me
                        </label>

                        <button type="submit">Login</button>
                    </div>
                </form>

                <div className="container">
                    <button type="button" className="cancelbtn" onClick={() => setIsOpen(false)}>Cancel</button>
                    <span className="psw">Forgot <a href="#">password?</a></span>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;