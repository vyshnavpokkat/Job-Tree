import React from 'react';
import { useNavigate } from 'react-router';
import logo from '../assets/logo_nav.png'


export const Navbar: React.FC = () => {
    const navigate = useNavigate()
    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ position: 'sticky', top: '0', zIndex: '1000', backgroundColor: "#051630" }}>
            <div className="container">
                <span className="navbar-brand cursor-pointer text-bold" onClick={() => navigate('/')}>
                    <img src={logo} alt={` logo`} className="mr-3" style={{ width: '50px' }} />
                </span>
            </div>
        </nav>
    );
};
