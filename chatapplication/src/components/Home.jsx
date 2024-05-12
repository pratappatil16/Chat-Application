
import "../front.css"
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from "./Navbar";

const socket = io("http://localhost:2000");
export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userList, setUserList] = useState([]);
    let getUser = () => {
        try {
            fetch("http://localhost:2000/getUser", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify({ id: user._id }),
            }).then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data)
                if (data.status) {
                    console.log(data.chat)
                    setUserList(data.chat)
                }
                else {
                    alert(data.message)
                }
            })
        } catch (error) {
            console.error(error);
            // navigate("/login");
        }
    }
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
            setUser(parsedUser);

            fetch("http://localhost:2000/getUser", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify({ id: parsedUser._id }),
            }).then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data)
                if (data.status) {
                    console.log(data.chat)
                    setUserList(data.chat)
                }
                else {
                    alert(data.message)
                }
            })
        } catch (error) {
            console.error(error);
            navigate("/login");
        }
    }, [navigate]);
    return (
        <> <Navbar></Navbar>
            <div class="container" >

                <h1>Users</h1>
                <ul className="user-list" style={{ width: "50vw", height: "50vh" }}>
                    {userList.map((val) => {
                        return <li className="user" key={val._id}>
                            <span className="name">{(val.person1._id === user._id) ? val.person2.name : val.person1.name}</span>

                            <button className="chat-button" onClick={() => { navigate("/chat/" + val._id) }}>Chat</button>
                        </li>
                    })}
                </ul>
            </div>
        </>
    )

}
