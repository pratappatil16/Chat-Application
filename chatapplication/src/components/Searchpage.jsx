import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';


export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [user, setUser] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
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
            setUser(parsedUser)
        } catch (error) {
            console.error(error);
            navigate("/login");
        }
    }, [navigate]);
    const handleSearch = async () => {
        try {
            fetch("http://localhost:2000/search", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify({ email: query }),
            }).then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data)
                if (data.status) {
                    console.log("ll")
                    setSearchResults(data.user)
                }
                else {
                    alert(data.message)
                }
            })

        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const startChat = (userId) => {
        try {
            fetch("http://localhost:2000/conversation", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify({ person1: user._id, person2: userId }),
            }).then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data)
                if (data.status) {
                    console.log("yes")
                }
                else {
                    alert(data.message)
                }
            })

        } catch (error) {
            console.error('Error searching users:', error);
        }
        console.log('Start chat with user:', userId);
    };

    return (
        <div className="search-page">
            <Navbar></Navbar>
            <h2>Search Users</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <ul className="search-results">

                {(searchResults) ? (<li className="user-item" >
                    <span className="user-name">{searchResults.name}</span>
                    <button onClick={() => startChat(searchResults._id)} className="start-chat-btn">Start Chat</button>
                </li>) : ""}


            </ul>
        </div>
    );
}
