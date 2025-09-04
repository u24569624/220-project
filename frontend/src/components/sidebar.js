import React from 'react';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import '../styles/global.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div id="main">
            <div id="open" onClick={() => setIsOpen(true)}>
                <div className="icon"></div>
                <div className="icon"></div>
                <div className="icon"></div>
            </div>

            <div id="Sidebar" className={`${isOpen ? 'show' : 'close'}`}>
                <div className="closebtn" onClick={() => setIsOpen(false)}>&times;</div>
                <Link to="/">Splash</Link>
                <Link to="/home">Home</Link>
                <Link to="/project/456">Project</Link>
            </div>
        </div>
    )
}

export default Sidebar;