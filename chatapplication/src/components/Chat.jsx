
import "../styles.css"
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from "./Navbar";

const socket = io("http://localhost:2000");
export default function Chat() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [user, setuser] = useState();
    const [userChat, setuserChat] = useState();
    let conId = useParams();
    console.log(conId)
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
            setuser(parsedUser)
        } catch (error) {
            console.error(error);
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        try {
            fetch("http://localhost:2000/getChat", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify({ id: conId.id }),
            }).then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data)
                if (data.status) {
                    console.log(data.chat)
                    setMessageList(data.chat)
                }
                else {
                    alert(data.message)
                }
            })

        } catch (error) {
            console.error('Error searching users:', error);
        }
    }, []);



    useEffect(() => {
        try {
            fetch("http://localhost:2000/getPerson", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify({ id: conId.id }),
            }).then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data)
                if (data.status) {
                    console.log(data.conversation)
                    setuserChat(data.conversation)
                }
                else {
                    alert(data.message)
                }
            })

        } catch (error) {
            console.error('Error searching users:', error);
        }
    }, []);

    useEffect(() => {
        const handleReceiveMessage = (data) => {
            // alert(data.message)
            console.log(data, data.roomid, conId.id)
            if (data.conversation === conId.id)
                setMessageList(prevList => [...prevList, { message: data.message }]);
        };
        socket.on("receive_message", handleReceiveMessage);
        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() !== "") {


            if (userChat?.person1._id==user._id&&!userChat?.person2.isActive) {
                socket.emit("send_message", { message: message, roomid: conId.id, sender: user._id,nextSender:userChat?.person2._id});
                setMessageList(prevList => [...prevList, { message: message, sender: user._id, roomid: conId.id }]);
                setMessage("");
            }
            else if (userChat?.person2._id==user._id&&!userChat?.person1.isActive) {
                socket.emit("send_message", { message: message, roomid: conId.id, sender: user._id ,nextSender:userChat?.person2._id});
                setMessageList(prevList => [...prevList, { message: message, sender: user._id, roomid: conId.id }]);
                setMessage("");
            }
            else {
                socket.emit("send_message", { message: message, roomid: conId.id, sender: user._id });
                setMessageList(prevList => [...prevList, { message: message, sender: user._id, roomid: conId.id }]);
                setMessage("");
            }
        }
    };
    return (
        <div >
            <Navbar></Navbar>
            <div className="chat-container" style={{ width: "70vw", height: "70vh" }}>
                <div className="chat-box" id="chat-box">
                    {messageList.map((val, index) => {
                        console.log(val)
                        return <div key={index} className={(user._id === val.sender) ? "message sent" : "message received"}>
                            <span className="sender">{(val.sender === userChat?.person1?._id) ? userChat?.person1?.name : userChat?.person2?.name}</span>
                            <p>{val.message}</p>
                            <span className="timestamp">{val.time}</span>
                        </div>
                    })}

                </div>
            </div>
            <div className="input-box">
                <input type="text" id="message-input" placeholder="Type your message..." val={message} onChange={(e) => { setMessage(e.target.value) }} />
                <button id="send-button" onClick={handleSubmit}>Send</button>
            </div>
        </div>
    )
}
