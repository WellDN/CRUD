import { Link } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

export function Home() {


  return(
    <>
  <div>
   <div>
     <a>
      <Link
   to={"/login"}>
    login
    </Link>
    </a>
    </div>
    <a>
      <Link
       to={"/signup"}>
        signup
        </Link>
        </a>
        <div>
        <button onClick={() => (googleLogout)}>logout</button>
        </div>
  </div>
  </>
  )
}
