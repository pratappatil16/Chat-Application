import React from 'react'
import {Link} from "react-router-dom"
import "../Register.css"
export default function Register() {
    return (
        <div>
            <div className="FormContainer">
                <div className="brand">
                    <i className="fa-regular fa-user fa-2xl" style={{color:"#74C0FC"}}></i>
                    <h1>Register</h1>
                </div>
                <form action="/register" method="POST">
                    <input type="text" placeholder="Name" required />
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Password" required />
                    <input type="password" placeholder="Confirm Password" required />
                    <button type="submit">Register</button>
                </form>
                <div className="signup">
                    <span>Already have an account? <Link to="/login">Log In</Link></span>
                </div>
            </div>
        </div>
    )
}
