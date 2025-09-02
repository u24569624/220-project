import React from 'react';
import {useState} from 'react';
import '../styles/global.css';

const SignUpForm = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return(
    <div className="SignUp">
        <button onClick={() => setIsOpen(true)}>Sign Up</button>

        <div className={`${isOpen ? 'show' : 'close'}`}>
            <h1>Sign Up</h1>
            <p>Please fill in this form to create an account.</p>
            <hr/>

            <label><b>Email</b></label>
            <input type="text" placeholder="Enter Email" name="email" required/>

            <label><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="psw" required/>

            <label><b>Repeat Password</b></label>
            <input type="password" placeholder="Repeat Password" name="psw-repeat" required/>

            <label>
            <input type="checkbox" name="remember" /> Remember me
            </label>

            <p>By creating an account you agree to our <a href="#">Terms & Privacy</a>.</p>

            <div className="clearfix">
            <button type="button" className="cancelbtn" onClick={() => setIsOpen(false)}>Cancel</button>
            <button type="submit" className="signupbtn">Sign Up</button>
            </div>
        </div>

    </div>
    );
}

export default SignUpForm;