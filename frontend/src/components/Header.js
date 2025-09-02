import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    return (
        <nav>
            <img src="/assets/images/Logo.png" alt="Logo" ></img>
            <h1>Name</h1>
            <ul>
                <li>links</li>
            </ul>
        </nav>
    );
};

export default Header;