import React, { useState } from 'react';
import '../styles/global.css';

const SignUpForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!repeatPassword) {
            newErrors.repeatPassword = 'Repeat password is required';
        } else if (repeatPassword !== password) {
            newErrors.repeatPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Stubbed submit logic - in future, this would make API call
            console.log('Sign up submitted:', { email, password });
            // Close the form or handle success
            setIsOpen(false);
        }
    };

    return (
        <div className="SignUp">
            <button onClick={() => setIsOpen(true)}>Sign Up</button>

            <div className={`${isOpen ? 'show' : 'close'}`}>
                <h1>Sign Up</h1>
                <p>Please fill in this form to create an account.</p>
                <hr />

                <form onSubmit={handleSubmit}>
                    <label><b>Email</b></label>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && <p className="error">{errors.email}</p>}

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

                    <label><b>Repeat Password</b></label>
                    <input
                        type="password"
                        placeholder="Repeat Password"
                        name="psw-repeat"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        required
                    />
                    {errors.repeatPassword && <p className="error">{errors.repeatPassword}</p>}

                    <label>
                        <input type="checkbox" name="remember" /> Remember me
                    </label>

                    <p>By creating an account you agree to our <a href="#">Terms & Privacy</a>.</p>

                    <div className="clearfix">
                        <button type="button" className="cancelbtn" onClick={() => setIsOpen(false)}>Cancel</button>
                        <button type="submit" className="signupbtn">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;