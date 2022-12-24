import { Route, Routes } from "react-router-dom"
import { Home } from "./Home"
import { Login } from "./login"
import { Signup } from "./signup"

export default function App() {
    return (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
  </Routes>
    )
}