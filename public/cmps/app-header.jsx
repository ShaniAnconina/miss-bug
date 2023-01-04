const { useState, useEffect } = React
const { NavLink } = ReactRouterDOM

import { userService } from '../services/user.service.js'
import { LoginSignup } from './login-signup.jsx'


export function AppHeader() {
    const [user, setUser] = useState(userService.getLoggedinUser())

    function onChangeLoginStatus(user) {
        setUser(user)
    }
    
    function onLogout() {
        userService.logout()
            .then(() => {
                setUser(null)
            })
    }

    // useEffect(() => {
    //     // component did mount when dependancy array is empty
    // }, [])

    return (
        <header className='header-container'>
            <p>Miss<span>b</span>ug</p>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/bug">Bugs</NavLink>
                <NavLink to="/about">About</NavLink>
            </nav>
            {user ? (
                < section >
                    <h2>Hello {user.fullname}</h2>
                    <button onClick={onLogout}>Logout</button>
                </ section >
            ) : (
                <section>
                    <LoginSignup onChangeLoginStatus={onChangeLoginStatus} />
                </section>
            )}
        </header>
    )
}
