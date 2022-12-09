import { Route, Routes } from "react-router-dom"
import { Home } from "./Home"
import { Login } from "./login"
import { ISignup } from "./Sign-up"


export default function App() {
    return (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/home" element={<ISignup />} />
    <Route path="/home" element={<Login />} />
  </Routes>
    )
}