import "../Login.css"
import logo from '../assets/robot.gif'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    let navigation = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("d")
        fetch("http://localhost:2000/login", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(formData),
        }).then((res) => {
            return res.json();
        }).then((data) => {
            if (data.status) {
                console.log("ll")
                localStorage.setItem("user", JSON.stringify(data.user));
                navigation("/")
            }
            else {
                alert(data.message)
            }
        })

    };
    return (
        <div>
            <div className="FormContainer">
                <div className="brand">
                    <i className="fa-regular fa-user fa-2xl" ></i>
                    <h1>Login</h1>
                    <img src={logo} alt="loading" height={120} width={120} />

                </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username or Email" required value={formData.email} onChange={(e) => { setFormData({ email: e.target.value, password: formData.password }) }} />
                    <input type="password" placeholder="Password" required value={formData.password} onChange={(e) => { setFormData({ email: formData.email, password: e.target.value }) }} />
                    <button type="submit">Log In</button>
                </form>
                <div className="signup">
                    <p>Don't have an account? <Link to="/register">Sign Up</Link> </p>
                </div>
            </div>
        </div>
    )
}
