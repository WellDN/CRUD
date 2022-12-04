import { ReactElement, useEffect, useState } from 'react';
import express from 'express'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { Route } from 'react-router-dom';
import multer from 'multer'
import error from 'http-errors';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

type User = {
  name: string;
  email: string;
  password: string;
}


export function Login(): ReactElement {

  const serv = express();

serv.use(bodyParser.urlencoded({ extended: true}))
serv.use(bodyParser.json());

serv.use('/', Route);

  const port = process.env.PORT || 5000;
  serv.listen(port, () => {
    return(`server is running on port ${port}`);
  })


  const router = express.Router();
  
  router.get('/', (_req, res) => {
    res.send('Hello World');
  })
  router.use('/auth', );
  router.use(async (_req, _res, next ) => {
    next(createHttpError.NotFound('Route Not Found'))
  })    //@ts-ignore
  router.use( (err, _req, res, _next) => {
    res.status(err.status || 500).json({
        status: false,
        message: err.message
    })
})
module.exports = router

const accessTokenSecret: any = process.env.ACCESS_TOKEN_SECRET
module.exports = {
    signAccessToken(payload:boolean){
        return new Promise((resolve, reject) => {
            jwt.sign({ payload }, accessTokenSecret, {
            }, (err, token) => {
                if (err) {
                reject(createHttpError.InternalServerError())
                }
                resolve(token)
            })
        })
    },
    verifyAccessToken(token: string){
        return new Promise((resolve, reject) => {
            jwt.verify(token, accessTokenSecret, (err: string | any, payload: string | any) => {
                if (err) {
                    const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message
                    return reject(createHttpError.Unauthorized(message))
                }
                resolve(payload)
            })
        })
    }
}

const prisma = new PrismaClient();

class AuthService {
  static async register(data:string | any) {
        const { email:string } = data;
        data.password = bcrypt.hashSync(data.password, 8);
        let user = prisma.user.create({
            data
        })//@ts-ignore
        data.accessToken = await jwt.signAccessToken(user);

        return data;
    }
}

module.exports = AuthService;

class lmao {
  static async iLogin(data: User) {
      const { email, password } = data;
      const user = await prisma.user.findUnique({
          where: {
              email
          }
      });
      if (!user) {
          throw createHttpError.NotFound('User not registered')
      }//@ts-ignore
      const checkPassword = bcrypt.compareSync(password, user.password)
      if (!checkPassword) throw createHttpError.Unauthorized('Email address or password not valid')
        //@ts-ignore
      delete user.password
      //@ts-ignore
      const accessToken = await jwt.signAccessToken(user)
      return { ...user, accessToken }
    }
    static async all() {
      const allUsers = await prisma.user.findMany();
      return allUsers;
    }
  }

  static register = async (req, res, next) => {
    try {
        const user = await auth.register(req.body);
        res.status(200).json({
            status: true,
            message: 'User created successfully',
            data: user
        })
    }
    catch (e) {
        next(createError(e.statusCode, e.message))
    }
}
static login = async (req, res, next) => {
     try {
        const data = await auth.login(req.body)
        res.status(200).json({
            status: true,
            message: "Account login successful",
            data
        })
    } catch (e) {
        next(createError(e.statusCode, e.message))
    }
}
static all = async (req, res, next) => {
    try {
        const users = await auth.all();
        res.status(200).json({
            status: true,
            message: 'All users',
            data: users
        })
    }
    catch (e) {
        next(createError(e.statusCode, e.message))
    }
}
}

module.exports = authController;

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
      return next(createError.Unauthorized('Access token is required'))
  }
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
      return next(createError.Unauthorized())
  }
  await jwt.verifyAccessToken(token).then(user => {
      req.user = user
      next()
  }).catch (e => {
      next(createError.Unauthorized(e.message))
  })
}

module.exports = auth;



  const [password, setPassword] = useState({
    firstPassword: '',
    confirmPassword: ''
  })
  const [register, isRegistered] = useState(false);
  const [login, isLogged] = useState();
  
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

  return (
    <>
    <div>
    <div className="w-full max-w-xs">
  <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
        Username
      </label>
      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"></input>
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstPassword">
      Password
      </label>
      <input onChange={inputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" name="firstPassword" type="password" placeholder="******************">
      </input>
    </div>
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
        Confirm Password
      </label>
      <input onChange={inputChange} className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" name="confirmPassword" type="password" placeholder="******************">
      </input>
      <p className="text-red-500 text-xs italic">Please confirm your password.</p>
    </div>
    <div className="flex items-center justify-between">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
        Register
      </button>
      <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
        Forgot Password?
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


        <div className="w-full max-w-xs">
  <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
        Username
      </label>
      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"></input>
    </div>
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
        Password
      </label>
      <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"></input>
      <p className="text-red-500 text-xs italic">Please choose a password.</p>
    </div>
    <div className="flex items-center justify-between">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
        Sign In
      </button>
      <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
        Forgot Password?
      </a>
    </div>
  </form>
  <p className="text-center text-gray-500 text-xs">
  </p>
</div>
</>
    )
}