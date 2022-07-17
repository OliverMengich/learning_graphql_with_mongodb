import React from 'react';
import { Link} from 'react-router-dom';
import './MainNavigation.css';
import AuthContext from '../../context/auth-context';
const mainNavigation =(props)=>(
    <AuthContext.Consumer>
        {(context)=>{
            return(
                <header className='main-navigation'>
                    <div className='main-navigation__logo'>
                        <h1>Easy Events</h1>
                    </div>
                    <nav className="main-navigation__items">
                        <ul>
                            {!context.token &&
                                <li>
                                    <Link to="/auth">Authenticate</Link>
                                </li>
                            }
                            <li>
                                <Link to="/events">Events</Link>
                            </li>
                            { context.token && (
                                <React.Fragment>
                                    <li>
                                        <Link to="/bookings">Bookings</Link>
                                    </li> 
                                    <li>
                                        <button onClick={context.logout}>LogOut</button>
                                    </li>
                                </React.Fragment>
                                )
                            }
                        </ul>
                    </nav>
                </header>
            );
        }}
        
    </AuthContext.Consumer>
)

export default mainNavigation;