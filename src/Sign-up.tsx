import React from "react";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { prisma, PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import createHttpError from "http-errors";


export function ISignup() {

  //const prisma = new PrismaClient();


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
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" >
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
