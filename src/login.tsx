type Login = {
    name: string | number;
    isLogged: boolean | void;
    login: boolean;
}

export function Login() {
    const register = () => {
        
    }

    const isLogged = true;
    
    const name = "";
    const password = "";
    const login = (name: Login, password: Login) => {

    }

    return (
    <div>
    <h1 className="font-bold">
      Login
   <textarea className="h-6 resize rounded-md">
      </textarea>
      </h1>
  <h1 className="">
      password 
      <textarea className="h-6 resize rounded-md">
          </textarea>
          </h1>
    </div>
    )
}