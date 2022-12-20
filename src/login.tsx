import { useEffect, useState } from 'react';
import { Link, useActionData, useNavigate } from 'react-router-dom';
import { useAuthStore } from './authStore';
import { getProfile, register, login } from './services/services';

export async function action({ request }) {
  try {
    let formData:Promise<void> = await request.formData();
    const type: string = formData.get("type");
    const email: string = formData.get("email");
    const password: string = formData.get("password");
    const response: Promise<void> = type === "register" ? await register({email, password}) : await login({email, password});
    const { accessToken, refreshToken } = response.data;
    return { tokens: { accessToken, refreshToken }, error: null };
  } catch (error) {
    return {
      error: error?.response?.data?.message || error.message,
      tokens: null,
    };
  }
}

export function Login () {

  const actionData = useActionData();
  const navigate = useNavigate();
  const login: string = useAuthStore((state) => state.login);
  const logout: (() => void) = useAuthStore((state) => state.logout);
  const isLoggedIn: boolean = useAuthStore((state) => state.isLoggedIn());
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      getProfile().then(({data}) => {
        setProfile(data);
      }).catch(error => {
        console.error(error);
      })
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (actionData?.tokens) {
      login(actionData.tokens);
      navigate("/");
    }
  }, [actionData]);

  if (isLoggedIn) {
    navigate("/");
  }


  return (
    <>
    <body>
    <div>
    <h1>Welcome to home page</h1>
      {isLoggedIn ? (
        <>
          Your user data:
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </>
      ) : (
        <>You are not logged in</>
      )}
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
    type="text"
    autoComplete="email"
    placeholder="Email"
    required
    />
  </div>
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstPassword">
   Password
    </label>
    <input    
    required
    id="password" 
    name="password" 
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
    id="register"
    name="type"
    value="register"
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
  </div>
        <div className="w-full max-w-xs">
  <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
      Email
    </label>
    <input
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      type="button">
        Login
        {actionData?.error && <div
         className="alert" role="alert">{actionData?.error}</div>}
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
<div>
        <ul>
        <li>
          {!isLoggedIn ? (
            <Link to="/login" className="">
              <strong>Login</strong>
            </Link>
          ) : (
            <button
              className=""
              onClick={() => logout()}
            >
              <strong>Logout</strong>
            </button>
          )}
        </li>
      </ul>
        </div>
</body>
</>
)
}