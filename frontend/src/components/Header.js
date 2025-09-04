import React from 'react';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import Sidebar from './sidebar.js'
import '../styles/Header.css';
import '../styles/global.css';

const Header = () => {
    const [searchTerm, setSearchTerm] = React.useState('');

    //temp search that will likely be changed
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    return (
        <nav>
            <Sidebar/>
            <img src="/assets/images/Logo.png" alt="Logo" ></img>
            <h1>Name</h1>
            <input id="search" type="text" placeholder="Search" value={searchTerm} onChange={handleSearch}></input>
            <Link to="/profile/123"><span className="material-symbols-outlined">account_circle</span></Link>
        </nav>
    );
};

export default Header;