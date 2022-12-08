import React, { Component } from "react";
import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import userService from "./user-service";

const AuthContext = React.createContext({});

const API_URL = "http://localhost:8080/api/auth/";

type Props = {};

type State = {
  username: string,
  email: string,
  password: string,
  successful: boolean,
  message: string
};

export default class Register extends Component<Props, State> {
  constructor(props: Props) {
    super(props);//@ts-ignore
    this.handleRegister = this.handleRegister.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      successful: false,
      message: ""
    };
  }
}
class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username: string, email: string, password: string) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

new AuthService();


export const authHeader = () => {
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr)
    user = JSON.parse(userStr);

  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
  } else {
    return { 'x-access-token': null };
  }
}


export const useAuth = (): any => {
  return useContext(AuthContext)
}

export function ISignup() {

  //const prisma = new PrismaClient();
  

  

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const passwordConfirmRef = useRef<HTMLInputElement>(null)
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
  
    async function handleSubmit(e: { preventDefault: () => void }) {
      e.preventDefault()
  
      if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
        return setError('Passwords do not match')
      }
  
      try {
        setError('')
        setLoading(true)
        await signup(emailRef.current?.value, passwordRef.current?.value)
        navigate('/')
      } catch {
        setError('Failed to create an account')
      }
  
      setLoading(false)
    }


  const [password, setPassword] = useState({
    firstPassword: '',
    confirmPassword: '',
  })
  
  const [validLength, setValidLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [upperCase, setUpperCase] = useState(false);
  const [lowerCase, setLowerCase] = useState(false);
  const [specialChar, setSpecialChar] = useState(false);
  const [match, setMatch] = useState(false);
  const [requiredLength, setRequiredLength] = useState(8);

const inputChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    const { value, name } = event.target;
    setPassword({
      ...password,
      [name]: value
    })
  }
  useEffect(() => {
    setValidLength(password.firstPassword.length >= requiredLength ? true : false);
    setUpperCase(password.firstPassword.toLowerCase() !== password.firstPassword);
    setLowerCase(password.firstPassword.toUpperCase() !== password.firstPassword);
    setHasNumber(/\d/.test(password.firstPassword));
    setMatch(!!password.firstPassword && password.firstPassword === password.confirmPassword)
    setSpecialChar(/[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(password.firstPassword));

  }, [password, requiredLength]);
  return(
    <div>    
    <div className="w-full max-w-xs">
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
    <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
      Email
    </label>
    <input
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    id="email-adress"
    name="email"
    type="email"
    autoComplete="email"
    ref={emailRef}
    required
    placeholder="Email"
    />
  </div>
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstPassword">
    Password
    </label>
    <input
    onChange={inputChange}
    ref={passwordRef}
    required
    id="password" 
    name="firstPassword" 
    type="password" 
    placeholder="******************"
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
  <div className="mb-6">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
      Confirm Password
    </label>
    <input 
    onChange={inputChange}
    ref={passwordConfirmRef} 
    required       
    placeholder="******************"
    id="confirmPassword"
    type="password"
    name="confirmPassword"
    className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
    />
    <p className="text-red-500 text-xs italic">Please confirm your password.</p>
  </div>
  <div className="flex items-center justify-between">
    <button
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    type="submit"
    disabled={loading}
    >
      Sign Up
    </button>
  </div>
  <div className="flex items-center justify-between">

  <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
  <Link
  className=""
    to="/login"
  >
    Already have an account?
  </Link>
  </a>
 </div>
</form>
    <p className="text-center text-gray-500 text-xs">
    </p>
  </div>
  <ul>
    <li>
      Valid Length: {validLength ? <span>True</span> : <span>False</span>}
    </li>
    <li>
      Has a Number: {hasNumber ? <span>True</span> : <span>False</span>}
    </li>
    <li>
      UpperCase: {upperCase ? <span>True</span> : <span>False</span>}
    </li>
    <li>
      LowerCase: {lowerCase ? <span>True</span> : <span>False</span>}
    </li>
    <li>Match: {match ? <span>True</span> : <span>False</span>}</li>
    <li>
      Special Character: {specialChar ? <span>True</span> : <span>False</span>}
    </li>
  </ul>    
  </div>
  )
}