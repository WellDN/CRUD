import { GoogleLogin, googleLogout } from '@react-oauth/google'
import { useEffect } from 'react';
import { gapi } from 'gapi-script'

type WrapProps = {
  valid: JSX.Element | boolean
  profileObj: boolean
}

const userId = "828311702305-3o4usi5raebpt6j1lim7rip91in43b0m.apps.googleusercontent.com"

function IAuth (res: WrapProps) {

const valid = () => {
  console.log('Valid', res.profileObj);
}

const notValid = () => {
  console.log('F', res)
}

function Logout () {

  const onSucess = () => {
    console.log('Log out w');
  }

  return (
    <div>{onSucess}</div>
  )
}

}


function Auth () {

useEffect(() => {
  function start() {
    gapi.client.init({
      clientId: userId,
      scope: ""
    })
  };

  gapi.load('client:auth2', start)
})

return (
  <div className="flex justify-center">
  <button className="">Auth
    {valid} {notValid} {logout}
  </button>
</div>
)
}