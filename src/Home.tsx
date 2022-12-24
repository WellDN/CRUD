import { Link } from "react-router-dom";

export function Home() {
  return(
    <>
  <div>
   <div>
     <a>
      <Link
   to="/login">
    login
    </Link>
    </a>
    </div>
    <a>
      <Link
       to="/signup">
        signup
        </Link>
        </a>
  </div>
  </>
  )
}