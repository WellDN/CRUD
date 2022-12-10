import { Route, Routes } from "react-router-dom"
import { Home } from "./Home"
import { Login } from "./login"


export default function App() {
    return (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/home" element={<Login />} />
  </Routes>
    )
}