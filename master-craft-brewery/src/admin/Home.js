import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaBuilding, FaHamburger, FaImages, FaUser } from 'react-icons/fa';
import { MdEvent } from 'react-icons/md';
import { IoMdBeer } from 'react-icons/io';
import { GiMeal } from 'react-icons/gi';
import { GrBlockQuote } from 'react-icons/gr';
import { useSessionStorage } from './util/Session.js';
import { BiLogOut } from 'react-icons/bi';
import './Home.css';

function Home(props) {
    const [keycloak, setKeycloak] = useState(null);
    const [token, setToken] = useSessionStorage("token", "");
    const history = useHistory();

    const redirectToLogin = useCallback(() => {
        history.push({ pathname: `/admin` });
    }, [history]);

    useEffect(() => {
        if (props.keycloak !== undefined) {
            setKeycloak(props.keycloak);
            setInterval(() => {
                props.keycloak.updateToken(60);
                setToken(props.keycloak.token);
            }, 3000);
        }
        else
            redirectToLogin();
        return () => {
            setKeycloak(null);
        }
    }, [props.keycloak, setKeycloak, redirectToLogin])

    const logout = () => {
        keycloak.logout();
        setToken(null);
    }

    return (
        <>
            <nav className="nav flex-column">
                <div className="monteserrat-font-09em">
                    <ul>
                        <li className="nav-item">
                            <Link to="/admin/company" className="nav-links">
                                <FaBuilding className='admin-icon' />   Kompanija
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin/administrators" className="nav-links">
                                <FaUser className='admin-icon' /> Administratori
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin/events" className="nav-links">
                                <MdEvent className='admin-icon' /> Događaji
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin/gallery" className="nav-links">
                                <FaImages className='admin-icon' /> Slike
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin/quotes" className="nav-links" >
                                <GrBlockQuote className='admin-icon' /> Citati
                            </Link>
                        </li>
                        <li className="nav-item contact">
                            <Link to="/admin/food-menu" className="nav-links">
                                <FaHamburger className='admin-icon' /> Jelovnik
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin/products" className="nav-links" >
                                <IoMdBeer className='admin-icon' /> Proizvodi
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin/product-options" className="nav-links" >
                                <GiMeal className='admin-icon' /> Tipovi proizvoda i porcije
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin" className="nav-links" onClick={() => logout()}>
                                <BiLogOut className="admin-icon" />  Odjavi se
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Home
