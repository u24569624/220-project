import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/Header.css';
import Sidebar from '../components/sidebar.js'
import '../styles/global.css';

const Header = () => {
    return (
        <nav>
            <Sidebar/>
            <img src="/assets/images/Logo.png" alt="Logo" ></img>
            <h1>Name</h1>
            <input type="search"></input>
            <Link to="/profile/123"><span className="material-symbols-outlined">account_circle</span></Link>
        </nav>
    );
};

export default Header;