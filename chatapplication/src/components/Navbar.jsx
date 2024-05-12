import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
    const [user, setuser] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        try {
            const user = localStorage.getItem("user");
            if (!user) {
                navigate("/login");
            }
            const parsedUser = JSON.parse(user);
            if (!parsedUser) {
                navigate("/login");
            }
            else {

            }
            setuser(parsedUser)
        } catch (error) {
            console.error(error);
            navigate("/login");
        }
    }, [navigate]);

    let handle = (status) => {
        try {
            fetch("http://localhost:2000/changeStatus", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify({ id: user._id, status: status }),
            }).then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data)
                if (data.status) {
                    // console.log(data.chat)
                    localStorage.setItem("user", JSON.stringify(data.user));
                    setuser(data.user)
                }
                else {
                    alert(data.message)
                }
            })

        } catch (error) {
            console.error('Error searching users:', error);
        }
    }
    return (
        <div>
            <ul style={{ display: 'flex' }}>
                <li style={{ color: "white", listStyle: "none" }}><Link to="/" style={{ color: "white", textDecoration: "none", marginRight: "10px" }}>Home</Link></li>
                <li style={{ color: "white", listStyle: "none" }}><Link to="/search" style={{ color: "white", textDecoration: "none", marginRight: "10px" }}>search</Link></li>
                
                <li style={{ color: "white", listStyle: "none" }} onClick={() => {
                    try {

                        localStorage.removeItem("user")
                        navigate("/login");
                    } catch (error) {

                    }
                }}><Link style={{ color: "white", textDecoration: "none", marginRight: "10px" }}>logout</Link></li>

                {user?.isActive ? <li style={{ color: "white", listStyle: "none" }} onClick={() => {
                    handle(false)
                }}><Link style={{ color: "white", textDecoration: "none", marginRight: "10px" }}>Set status Block</Link></li> : <li style={{ color: "white", listStyle: "none" }} onClick={() => {
                    handle(true)
                }}><Link style={{ color: "white", textDecoration: "none", marginRight: "10px" }}>Set status Active</Link></li>}
            </ul>
        </div>
    )
}
