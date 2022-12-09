import { useRef, useState } from 'react';
import { PrismaClient } from '@prisma/client'
import { Link, useNavigate } from 'react-router-dom';
import { ISignup } from './Sign-up';


type User = {
  name: string;
  email: string;
  password: string;
}

export function Login (){
  
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  
  return (
    <>
    <body>
    <ISignup/>
        <div className="w-full max-w-xs">
  <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
      Email
    </label>
    <input
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
     ref={emailRef}
     required
     id="email"
     name="email"
     type="text"
     placeholder="Email"
     autoComplete="email"
    />
    </div>
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
        Password
      </label>
      <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      ref={passwordRef}
      id="password"
      type="password"
      name="loginPassword"
      placeholder="******************"
      autoComplete='current-password'
      required
      />
      <p className="text-red-500 text-xs italic">Please choose a password.</p>
    </div>
    <div className="flex items-center justify-between">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
        Login
      </button>
      <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
      <Link className=""
      to="/forgot-password"
      >
        Forgot Password?
      </Link>
      </a>
    </div>
  </form>
  <p className="text-center text-gray-500 text-xs">
  </p>
</div>
</body>
</>
    )
}