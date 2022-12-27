//@ts-nocheck
import { Link, Route, Routes } from "react-router-dom"
import { Home } from "./Home"
import { Login } from "./login"
import { Signup } from "./signup"

export default function App() {
  
    return (
      <div>
        <Link
        to="">
          Home
        </Link>
      <div>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
  </Routes>
  </div>
  </div>
    )
}