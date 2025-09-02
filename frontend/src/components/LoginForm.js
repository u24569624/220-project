import React from 'react';
import {useState} from 'react';
import '../styles/global.css';

const LoginForm = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return(
    <div className="login">
        <button onClick={() => setIsOpen(true)}>Login</button>

        <div className={`${isOpen ? 'show' : 'close'}`}>
            <div className="imgcontainer">
                <span className="material-symbols-outlined">account_circle</span>
            </div>

            <div className="container">
                <label ><b>Username</b></label>
                <input type="text" placeholder="Enter Username" name="uname" required/>

                <label ><b>Password</b></label>
                <input type="password" placeholder="Enter Password" name="psw" required/>

                <button type="submit">Login</button>
                <label>
                <input type="checkbox"  name="remember"/> Remember me
                </label>
            </div>

            <div className="container" >
                <button type="button" className="cancelbtn" onClick={() => setIsOpen(false)}>Cancel</button>
                <span className="psw">Forgot <a href="#">password?</a></span>
            </div>
        </div>
    </div>
    );
}

export default LoginForm;