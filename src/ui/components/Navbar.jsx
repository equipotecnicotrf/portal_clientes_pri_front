import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            
            <Link 
                className="navbar-brand" 
                to="/"
            >
                HOME 
            </Link>

            <div className="navbar-collapse">
                <div className="navbar-nav">

                    <NavLink 
                        
                        className={ ({isActive}) =>`nav-item nav-link ${ isActive ? 'active':''} ` }
                        to="/homepage"
                    >
                        Perfil
                    </NavLink>

                    <NavLink 
                        
                        className={ ({isActive}) =>`nav-item nav-link ${ isActive ? 'active':''} ` }
                        to="/login"
                    >
                        Login
                    </NavLink>
                </div>
            </div>

            
        </nav>
    )
}