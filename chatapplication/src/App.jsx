import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from './components/Chat'
import SearchPage from './components/Searchpage'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{width:"100vw",height:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home> }></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/search" element={<SearchPage></SearchPage>}></Route>
        <Route path="/chat/:id" element={<Chat></Chat>}></Route>
        <Route path = "*" element={<h1>Not Found</h1>}></Route>
        
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
