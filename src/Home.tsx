import { Auth } from "./auth";
import { Login } from "./login";

export function Home() {
    return(
        <body>
        <div>
        <Login />
        </div>
        <Auth />
      </body>
    )
}