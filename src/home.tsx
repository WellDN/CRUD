import { Auth } from './auth'

export function Home () {

    return (
    <body>
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
    <Auth />
</body>
    )    
}