import { Route, Routes } from "react-router-dom"
import { Home } from "./Home"
import { Login, action as loginAction } from "./login"


export default function App() {
    return (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/home" element={<Login />} />
    <Route path="/login" element={<Login />} />    
  </Routes>
    )
}